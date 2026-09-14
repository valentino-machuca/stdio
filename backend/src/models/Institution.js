const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Institution = sequelize.define('Institution', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { timestamps: false, underscored: true, tableName: 'institutions' });

  Institution.associate = (models) => {
    Institution.hasMany(models.User, { foreignKey: 'institution_id' });
  };

  return Institution;
};