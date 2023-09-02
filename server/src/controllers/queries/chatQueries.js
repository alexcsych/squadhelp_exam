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
  const { interlocutorId } = req.query;
  const participants = [req.tokenData.userId, interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );

  try {
    const interlocutor = await bd.Users.findByPk(interlocutorId, {
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
  const userId = req.tokenData.userId;
  const predicate = req.body.participants.indexOf(userId);
  const updatedValue = req.body.blackListFlag;

  try {
    const chat = await bd.Conversations.findOne({
      where: {
        participants: req.body.participants,
      },
    });

    chat.setDataValue(
      'blackList',
      chat.blackList.map((value, index) => {
        if (index === predicate) return updatedValue;
        return value;
      })
    );

    const updatedChat = await chat.save();
    res.send(updatedChat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const predicate = req.body.participants.indexOf(userId);
  const updatedValue = req.body.favoriteFlag;

  try {
    const chat = await bd.Conversations.findOne({
      where: {
        participants: req.body.participants,
      },
    });

    chat.setDataValue(
      'favoriteList',
      chat.favoriteList.map((value, index) => {
        if (index === predicate) return updatedValue;
        return value;
      })
    );

    const updatedChat = await chat.save();
    res.send(updatedChat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const { catalogName, chatId } = req.body;
    const catalog = await bd.Catalogs.create({
      userId: req.tokenData.userId,
      catalogName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await bd.CatalogConversations.create({
      catalogId: catalog.id,
      conversationId: chatId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const catalogConversations = await bd.CatalogConversations.findAll({
      where: {
        catalogId: catalog.id,
      },
    });

    const catalogData = {
      _id: catalog.id,
      chats: catalogConversations.map(
        catCon => catCon.dataValues.conversationId
      ),
      catalogName,
    };
    res.send(catalogData);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const { catalogId, catalogName } = req.body;
    const { userId } = req.tokenData;
    await bd.Catalogs.update(
      { catalogName: catalogName },
      {
        where: {
          id: catalogId,
          userId,
        },
      }
    );
    const catalogConversations = await bd.CatalogConversations.findAll({
      where: {
        catalogId,
      },
    });
    const catalogData = {
      _id: catalogId,
      chats: catalogConversations.map(
        catCon => catCon.dataValues.conversationId
      ),
      catalogName,
      userId,
    };
    res.send(catalogData);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const { catalogId, chatId } = req.body;
    const { userId } = req.tokenData;

    const catalogConversations = await bd.CatalogConversations.findAll({
      where: {
        catalogId,
      },
    });

    let chats = catalogConversations.map(
      catCon => catCon.dataValues.conversationId
    );
    if (!chats.includes(chatId)) {
      chats.push(chatId);

      await bd.CatalogConversations.create({
        catalogId,
        conversationId: chatId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const catalogData = {
      _id: catalogId,
      chats,
      userId,
    };

    res.send(catalogData);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const { catalogId, chatId } = req.query;
    const { userId } = req.tokenData;

    const catCon = await bd.CatalogConversations.findOne({
      where: {
        catalogId,
        conversationId: chatId,
      },
    });
    await catCon.destroy();

    const catalogConversations = await bd.CatalogConversations.findAll({
      where: {
        catalogId,
      },
    });

    const catalog = await bd.Catalogs.findOne({
      where: {
        id: catalogId,
      },
    });

    const catalogData = {
      _id: catalogId,
      chats: catalogConversations.map(
        catCon => catCon.dataValues.conversationId
      ),
      userId,
      catalogName: catalog.dataValues.catalogName,
    };

    res.send(catalogData);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const { catalogId } = req.query;
    const userId = req.tokenData.userId;

    await bd.CatalogConversations.destroy({
      where: {
        catalogId: catalogId,
      },
    });

    await bd.Catalogs.destroy({
      where: {
        id: catalogId,
        userId: userId,
      },
    });

    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;

    const catalogs = await bd.Catalogs.findAll({
      where: { userId },
      attributes: ['id', 'catalogName'],
      include: [
        {
          model: bd.Conversations,
          as: 'chats',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    const transformedCatalogs = catalogs.map(catalog => ({
      _id: catalog.id,
      catalogName: catalog.catalogName,
      chats: catalog.chats.map(chat => chat.id),
    }));

    res.send(transformedCatalogs);
  } catch (err) {
    next(err);
  }
};
