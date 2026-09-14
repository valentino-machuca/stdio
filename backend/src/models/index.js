const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

const models = {
  Role: require('./Role')(sequelize),
  Institution: require('./Institution')(sequelize),
  Career: require('./Career')(sequelize),
  Subject: require('./Subject')(sequelize),
  Friendship: require('./Friendship')(sequelize),
  Conversation: require('./Conversation')(sequelize),
  Message: require('./Message')(sequelize),
  Group: require('./Group')(sequelize),
  User: require('./User')(sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;