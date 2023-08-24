module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('CatalogConversations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        catalogId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Catalogs',
            key: 'id',
          },
        },
        conversationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Conversations',
            key: 'id',
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        return queryInterface.addIndex(
          'CatalogConversations',
          ['catalogId', 'conversationId'],
          {
            unique: true,
            name: 'catalogConversationUniqueIndex',
          }
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeIndex('CatalogConversations', 'catalogConversationUniqueIndex')
      .then(() => {
        return queryInterface.dropTable('CatalogConversations');
      });
  },
};
