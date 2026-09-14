const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false }
  }, { tableName: 'conversations', timestamps: true, updatedAt: false, underscored: true });

  Conversation.associate = (models) => {
    Conversation.belongsTo(models.Group, { foreignKey: 'group_id', onDelete: 'CASCADE' });
    Conversation.belongsToMany(models.User, { through: 'conversation_participants', foreignKey: 'conversation_id', otherKey: 'user_id', timestamps: false, onDelete: 'CASCADE' });
    Conversation.hasMany(models.Message, { foreignKey: 'conversation_id' });
  };

  return Conversation;
};