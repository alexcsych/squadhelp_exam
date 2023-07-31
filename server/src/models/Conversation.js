module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      participants: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      blackList: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        allowNull: false,
        defaultValue: [false, false],
      },
      favoriteList: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        allowNull: false,
        defaultValue: [false, false],
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
    }
  );

  Conversation.associate = function (models) {
    Conversation.hasMany(models.Messages, {
      foreignKey: 'conversation',
      as: 'conversationData',
    });
    Conversation.belongsToMany(models.Catalogs, {
      through: 'CatalogConversations',
      foreignKey: 'conversationId',
      as: 'chats',
    });
  };

  return Conversation;
};
