const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Career = sequelize.define('Career', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { timestamps: false, underscored: true, tableName: 'careers' });

  Career.associate = (models) => {
    Career.hasMany(models.User, { foreignKey: 'career_id' });
  };

  return Career;
};