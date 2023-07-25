const { Catalog, Conversation, Message } = require('../../models/mongoModels');
const bd = require('../../models');
const controller = require('../../socketInit');
const { Op } = require('sequelize');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const [newConversation, created] = await bd.Conversations.findOrCreate({
      where: { participants },
      defaults: {
        participants,
        blackList: [false, false],
        favoriteList: [false, false],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const message = await bd.Messages.create({
      sender: req.tokenData.userId,
      body: req.body.messageBody,
      conversation: newConversation.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    message.participants = participants;
    const interlocutorId = participants.filter(
      participant => participant !== req.tokenData.userId
    )[0];
    const preview = {
      _id: newConversation.id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: newConversation.blackList,
      favoriteList: newConversation.favoriteList,
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        _id: newConversation.id,
        sender: req.tokenData.userId,
        text: req.body.messageBody,
        createAt: message.createdAt,
        participants,
        blackList: newConversation.blackList,
        favoriteList: newConversation.favoriteList,
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    const interlocutor = await bd.Users.findByPk(req.body.interlocutorId, {
      attributes: ['firstName', 'lastName', 'displayName', 'id', 'avatar'],
    });
    const conversation = await bd.Conversations.findOne({
      where: {
        participants: participants,
      },
    });
    if (!conversation) {
      return res.send({
        messages: [],
        interlocutor: {
          firstName: interlocutor.firstName,
          lastName: interlocutor.lastName,
          displayName: interlocutor.displayName,
          id: interlocutor.id,
          avatar: interlocutor.avatar,
        },
      });
    }
    const messages = await bd.Messages.findAll({
      where: {
        sender: {
          [Op.in]: participants,
        },
        conversation: conversation.id,
      },
      order: [['createdAt', 'ASC']],
      attributes: [
        'id',
        'sender',
        'body',
        'conversation',
        'createdAt',
        'updatedAt',
      ],
    });
    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const uniqueConversations = await bd.Conversations.findAll({
      include: {
        model: bd.Messages,
        as: 'conversationData',
        attributes: ['sender', 'body', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 1,
      },
      where: {
        participants: {
          [Op.contains]: [req.tokenData.userId],
        },
      },
    });
    const conversations = uniqueConversations.map(conversation => {
      return {
        _id: conversation.id,
        sender: conversation.conversationData[0].sender,
        text: conversation.conversationData[0].body,
        createAt: conversation.conversationData[0].createdAt,
        participants: conversation.participants,
        blackList: conversation.blackList,
        favoriteList: conversation.favoriteList,
      };
    });
    const interlocutors = [];
    conversations.forEach(conversation => {
      conversation.participants.forEach(participant => {
        if (participant !== req.tokenData.userId) {
          interlocutors.push(participant);
        }
      });
    });
    const senders = await bd.Users.findAll({
      where: {
        id: interlocutors,
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
    conversations.forEach(conversation => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const predicate =
    'blackList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.blackListFlag } },
      { new: true }
    );
    res.send(chat);
    const interlocutorId = req.body.participants.filter(
      participant => participant !== req.tokenData.userId
    )[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const predicate =
    'favoriteList.' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversation.findOneAndUpdate(
      { participants: req.body.participants },
      { $set: { [predicate]: req.body.favoriteFlag } },
      { new: true }
    );
    res.send(chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  console.log(req.body);
  const catalog = new Catalog({
    userId: req.tokenData.userId,
    catalogName: req.body.catalogName,
    chats: [req.body.chatId],
  });
  try {
    await catalog.save();
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { catalogName: req.body.catalogName },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $addToSet: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalog.findOneAndUpdate(
      {
        _id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
      { $pull: { chats: req.body.chatId } },
      { new: true }
    );
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Catalog.remove({
      _id: req.body.catalogId,
      userId: req.tokenData.userId,
    });
    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalog.aggregate([
      { $match: { userId: req.tokenData.userId } },
      {
        $project: {
          _id: 1,
          catalogName: 1,
          chats: 1,
        },
      },
    ]);
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
