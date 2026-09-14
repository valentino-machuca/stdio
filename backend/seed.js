const { Institution, Career, sequelize } = require('./src/models');

const universities = [
  'Universidad de Buenos Aires (UBA)',
  'Universidad Tecnológica Nacional (UTN)',
  'Universidad Nacional de La Plata (UNLP)',
  'Universidad Nacional de Córdoba (UNC)',
  'Universidad Nacional de Rosario (UNR)',
  'Universidad Nacional de Cuyo (UNCuyo)',
  'Universidad Nacional de Tucumán (UNT)',
  'Universidad Nacional del Litoral (UNL)',
  'Universidad Nacional de Mar del Plata (UNMDP)',
  'Universidad Argentina de la Empresa (UADE)',
  'Pontificia Universidad Católica Argentina (UCA)',
  'Instituto Tecnológico de Buenos Aires (ITBA)',
  'Universidad Siglo 21'
];

const genericCareers = [
  'Ingeniería en Sistemas',
  'Ingeniería Informática',
  'Ciencias de la Computación',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Medicina',
  'Odontología',
  'Psicología',
  'Abogacía / Derecho',
  'Arquitectura',
  'Administración de Empresas',
  'Contador Público',
  'Economía',
  'Diseño Gráfico',
  'Diseño Industrial',
  'Comunicación Social',
  'Marketing',
  'Biología / Cs. Biológicas'
];

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos para seed.');

    console.log('Insertando universidades...');
    for (const name of universities) {
      await Institution.findOrCreate({ where: { name } });
    }

    console.log('Insertando carreras...');
    for (const name of genericCareers) {
      await Career.findOrCreate({ where: { name } });
    }

    console.log('¡Datos insertados correctamente!');
  } catch (error) {
    console.error('Error poblando la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

runSeed();
