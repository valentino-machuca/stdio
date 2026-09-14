const { Role, sequelize } = require('./src/models');

async function runRolesSeed() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos para seed de roles.');

    await Role.findOrCreate({ where: { name: 'student' } });
    await Role.findOrCreate({ where: { name: 'teacher' } });
    await Role.findOrCreate({ where: { name: 'admin' } });

    console.log('¡Roles básicos insertados correctamente!');
  } catch (error) {
    console.error('Error insertando roles:', error);
  } finally {
    await sequelize.close();
  }
}

runRolesSeed();
