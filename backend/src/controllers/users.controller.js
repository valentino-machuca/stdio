const { User, Institution, Career } = require('../models');

const getUserMetadata = async (req, res) => {
  try {
    const institutions = await Institution.findAll();
    const careers = await Career.findAll();
    
    res.json({
      institutions,
      careers
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener datos.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, institution_id, career_id } = req.body;
    
    let profile_picture;
    if (req.file) {
      // Cloudinary stores the url in req.file.path
      profile_picture = req.file.path;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.name = name || user.name;
    user.institution_id = institution_id || user.institution_id;
    user.career_id = career_id || user.career_id;
    
    if (profile_picture) {
      user.profile_picture = profile_picture;
    }

    await user.save();

    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        institution_id: user.institution_id,
        career_id: user.career_id,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar perfil.' });
  }
};

const updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Se requieren latitud y longitud.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.location = {
      type: 'Point',
      coordinates: [longitude, latitude] // PostGIS uses [longitude, latitude]
    };

    await user.save();

    res.json({ message: 'Ubicación actualizada correctamente' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar ubicación.' });
  }
};

module.exports = { getUserMetadata, updateProfile, updateLocation };
