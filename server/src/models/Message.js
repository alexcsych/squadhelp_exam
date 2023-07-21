module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Messages',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sender: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      conversation: {
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
    }
  );

  Message.associate = function (models) {
    Message.belongsTo(models.Conversations, { foreignKey: 'conversation' });
    Message.belongsTo(models.Users, { foreignKey: 'sender' });
  };

  return Message;
};
