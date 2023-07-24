module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define(
    'Catalogs',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      catalogName: {
        type: DataTypes.STRING,
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

  Catalog.associate = function (models) {
    Catalog.belongsTo(models.Users, { foreignKey: 'userId' });
    Catalog.belongsToMany(models.Conversations, {
      through: 'CatalogChats',
      foreignKey: 'catalogId',
    });
  };

  return Catalog;
};
