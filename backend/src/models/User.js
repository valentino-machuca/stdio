const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    profile_picture: { type: DataTypes.STRING, validate: { isUrl: true } },
    location: { type: DataTypes.GEOMETRY('POINT', 4326) }
  }, 
  { 
    tableName: 'users',
    timestamps: true, 
    underscored: true,
    indexes: [
        {
            type: 'SPATIAL',
            fields: ['location']
        }
    ] 
  }
);

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: { name: 'role_id', allowNull: false } });
    User.belongsTo(models.Institution, { foreignKey: 'institution_id', onDelete: 'SET NULL' });
    User.belongsTo(models.Career, { foreignKey: 'career_id', onDelete: 'SET NULL' });
    User.belongsToMany(models.Subject, { through: 'users_subjects', foreignKey: 'user_id', otherKey: 'subject_id', timestamps: false, onDelete: 'CASCADE' });
    User.belongsToMany(models.Group, { through: 'groups_users', foreignKey: 'user_id', otherKey: 'group_id', timestamps: false, onDelete: 'CASCADE' });
    User.belongsToMany(models.User, { as: 'FriendRequestsSent', through: models.Friendship, foreignKey: 'sender_id', otherKey: 'receiver_id', onDelete: 'CASCADE' });
    User.belongsToMany(models.User, { as: 'FriendRequestsReceived', through: models.Friendship, foreignKey: 'receiver_id', otherKey: 'sender_id', onDelete: 'CASCADE' });
    User.belongsToMany(models.Conversation, { through: 'conversation_participants', foreignKey: 'user_id', otherKey: 'conversation_id', timestamps: false, onDelete: 'CASCADE' });
  };

  return User;
};