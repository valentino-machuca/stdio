const { Career, sequelize } = require('./src/models');

const extendedCareers = [
  // Ingeniería y Tecnología
  'Ingeniería en Sistemas / Informática',
  'Ingeniería de Software',
  'Ciencias de la Computación',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Electrónica / Electromecánica',
  'Ingeniería Mecánica',
  'Ingeniería Química',
  'Ingeniería Agronómica',
  'Ingeniería Ambiental',
  'Tecnicatura en Programación',
  
  // Salud y Medicina
  'Medicina',
  'Odontología',
  'Psicología',
  'Enfermería',
  'Kinesiología y Fisiatría',
  'Nutrición',
  'Veterinaria',
  'Farmacia',
  'Bioquímica',

  // Ciencias Exactas y Naturales
  'Matemática',
  'Física',
  'Biología / Ciencias Biológicas',
  'Química',
  'Geología',
  'Astronomía',

  // Ciencias Sociales y Humanidades
  'Abogacía / Derecho',
  'Ciencias Políticas',
  'Sociología',
  'Trabajo Social',
  'Historia',
  'Filosofía',
  'Letras / Literatura',
  'Ciencias de la Educación',
  'Relaciones Internacionales',
  'Comunicación Social / Periodismo',

  // Economía y Administración
  'Administración de Empresas',
  'Contador Público',
  'Economía',
  'Marketing / Comercialización',
  'Recursos Humanos',
  'Comercio Internacional',
  'Finanzas',

  // Arte, Diseño y Arquitectura
  'Arquitectura',
  'Diseño Gráfico',
  'Diseño Industrial',
  'Diseño de Indumentaria / Textil',
  'Diseño Multimedia y de Interacción',
  'Artes Plásticas / Visuales',
  'Cine y Artes Audiovisuales',
  'Música',

  // Otros
  'Traductorado',
  'Gastronomía',
  'Turismo y Hotelería',
  'Educación Física',
  'Otros'
];

async function updateCareers() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos.');

    console.log('Borrando carreras actuales...');
    // Usamos force y cascade para asegurar que se limpie la tabla 
    // Nota: esto dejará en null o fallará si hay usuarios asociados. Asumimos DB limpia.
    await Career.destroy({ where: {}, truncate: true, cascade: true });
    console.log('Carreras anteriores eliminadas.');

    console.log('Insertando la nueva lista extendida de carreras...');
    
    // Sort alphabetically but keep 'Otros' at the end
    const sortedCareers = extendedCareers.filter(c => c !== 'Otros').sort();
    sortedCareers.push('Otros');

    for (const name of sortedCareers) {
      await Career.create({ name });
    }

    console.log(`¡Se insertaron ${sortedCareers.length} carreras exitosamente!`);
    
  } catch (error) {
    console.error('Error actualizando carreras:', error);
  } finally {
    await sequelize.close();
  }
}

updateCareers();
