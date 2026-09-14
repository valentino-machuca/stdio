
const { Op } = require('sequelize');
const { User, Role } = require('../models');
const { validateEmail } = require('../utils/validations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      is_teacher,
      institution_id,
      career_id,
      latitude,
      longitude
    } = req.body;

    if (!email || !password || !username || !name) return res.status(400).json({ message: 'Faltan campos obligatorios, por favor revísalos' });

    if(validateEmail(email) === false) {
      return res.status(400).json({ message: 'El correo electrónico no es válido :(' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) return res.status(400).json({ message: 'El correo electrónico ya está registrado :(' });
      if (existingUser.username === username) return res.status(400).json({ message: 'El nombre de usuario ya está en uso :(' });
    }

    const role = await Role.findOne({ where: { name: is_teacher ? 'teacher' : 'student' } });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let location = null;
    if (latitude && longitude) {
      location = { type: 'Point', coordinates: [longitude, latitude] };
    }

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role_id: role.id,
      institution_id,
      career_id,
      location 
    });

    const token = jwt.sign({ id: newUser.id, role_id: newUser.role_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role_id: newUser.role_id
      }
    });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Debe proveer un usuario/email y contraseña.' });
    }

    const { Op } = require('sequelize');

    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
  }
};

module.exports = { register, login };
