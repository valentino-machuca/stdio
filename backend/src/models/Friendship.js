const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Friendship = sequelize.define('Friendship', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'), allowNull: false, defaultValue: 'pending' }
  }, 
  { 
    tableName: 'friendships', 
    timestamps: true, 
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['sender_id', 'receiver_id']
        }
    ]
  });

  Friendship.associate = (models) => {
    Friendship.belongsTo(models.User, { as: 'Sender', foreignKey: 'sender_id' });
    Friendship.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiver_id' });
  };

  return Friendship;
};