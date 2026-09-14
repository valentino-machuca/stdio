const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Group = sequelize.define('Group', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    is_private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    location: { type: DataTypes.GEOMETRY('POINT', 4326) }
  }, 
  { 
    tableName: 'groups', 
    timestamps: true, 
    underscored: true,
    indexes: [
        {
            type: 'SPATIAL',
            fields: ['location']
        }
    ]
  });

  Group.associate = (models) => {
    Group.belongsTo(models.User, { as: 'Creator', foreignKey: { name: 'creator_id', allowNull: false }, onDelete: 'CASCADE' });
    Group.belongsTo(models.Subject, { foreignKey: 'subject_id', onDelete: 'SET NULL' });
    Group.belongsToMany(models.User, { through: 'groups_users', foreignKey: 'group_id', otherKey: 'user_id', timestamps: false, onDelete: 'CASCADE' });
    Group.hasMany(models.Conversation, { foreignKey: 'group_id' });
  };

  return Group;
};