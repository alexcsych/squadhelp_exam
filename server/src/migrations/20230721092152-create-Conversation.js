module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      participants: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
      },
      blackList: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        allowNull: false,
        defaultValue: [false, false],
      },
      favoriteList: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        allowNull: false,
        defaultValue: [false, false],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversations');
  },
};
