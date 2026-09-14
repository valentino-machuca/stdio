const { Institution, sequelize } = require('./src/models');
const https = require('https');

async function fetchAndSeedUniversities() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    console.log('Obteniendo lista de universidades de Argentina desde API pública...');
    
    // Usamos el listado global de Hipo, que es muy completo y abierto
    const url = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', async () => {
        try {
          const allUniversities = JSON.parse(data);
          // Filtrar solo las de Argentina
          const argUniversities = allUniversities.filter(u => u.country === 'Argentina');
          
          console.log(`Se encontraron ${argUniversities.length} universidades de Argentina.`);
          
          let count = 0;
          for (const uni of argUniversities) {
            // Hipo a veces trae nombres repetidos o con variaciones, findOrCreate previene duplicados
            await Institution.findOrCreate({ where: { name: uni.name } });
            count++;
          }
          
          console.log(`¡Se insertaron/verificaron ${count} universidades nacionales y privadas exitosamente!`);
          await sequelize.close();
        } catch (e) {
          console.error('Error parseando JSON o insertando en DB:', e);
          await sequelize.close();
        }
      });

    }).on('error', (e) => {
      console.error('Error en la petición HTTPS:', e);
      sequelize.close();
    });

  } catch (error) {
    console.error('Error general:', error);
  }
}

fetchAndSeedUniversities();
