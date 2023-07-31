module.exports = (sequelize, DataTypes) => {
  const CatalogConversation = sequelize.define(
    'CatalogConversations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'catalogConversationUniqueIndex',
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'catalogConversationUniqueIndex',
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

  CatalogConversation.associate = function (models) {
    CatalogConversation.belongsTo(models.Catalogs, {
      foreignKey: 'catalogId',
      targetKey: 'id',
      onDelete: 'CASCADE',
    });
    CatalogConversation.belongsTo(models.Conversations, {
      foreignKey: 'conversationId',
      targetKey: 'id',
    });
  };

  return CatalogConversation;
};
