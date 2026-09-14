const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, { tableName: 'messages', timestamps: true, updatedAt: false, underscored: true });

  Message.associate = (models) => {
    Message.belongsTo(models.Conversation, { foreignKey: { name: 'conversation_id', allowNull: false }, onDelete: 'CASCADE' });
    Message.belongsTo(models.User, { as: 'Sender', foreignKey: { name: 'sender_id', allowNull: false }, onDelete: 'CASCADE' });
  };

  return Message;
};