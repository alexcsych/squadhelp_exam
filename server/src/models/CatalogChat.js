module.exports = (sequelize, DataTypes) => {
  const CatalogChat = sequelize.define(
    'CatalogChats',
    {
      catalogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      primaryKey: false,
    }
  );

  CatalogChat.associate = function (models) {
    CatalogChat.belongsTo(models.Catalogs, { foreignKey: 'catalogId' });
    CatalogChat.belongsTo(models.Conversations, { foreignKey: 'chatId' });
  };

  return CatalogChat;
};
