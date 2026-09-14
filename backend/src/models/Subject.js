const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subject = sequelize.define('Subject', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { timestamps: false, underscored: true, tableName: 'subjects' });

  Subject.associate = (models) => {
    Subject.belongsToMany(models.User, { through: 'users_subjects', foreignKey: 'subject_id', otherKey: 'user_id', timestamps: false, onDelete: 'CASCADE' });
    Subject.hasMany(models.Group, { foreignKey: 'subject_id' });
  };

  return Subject;
};