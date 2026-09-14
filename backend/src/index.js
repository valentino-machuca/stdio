require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');

// Import routes (placeholders)
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const groupRoutes = require('./routes/groups.routes');
const friendRoutes = require('./routes/friends.routes');
const mapRoutes = require('./routes/map.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to your frontend domain in production
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Socket.io for Real-Time Chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_group', (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  socket.on('send_message', (data) => {
    // Expected data: { groupId (or friendId), senderId, content }
    io.to(`group_${data.groupId}`).emit('receive_message', data);
    // TODO: Save message to database here
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

// Initialize Server and Database
const db = require('./models');

const startServer = async () => {
  await connectDB();
  
  try {
    // Habilitar PostGIS en la base de datos para soportar tipos GEOMETRY
    await db.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('Extensión PostGIS habilitada o ya existente.');
  } catch (error) {
    console.error('Advertencia: No se pudo crear la extensión PostGIS. Si no eres superusuario, instálala manualmente en la DB:', error.message);
  }

  // Ensure models are synchronized with the database (creates tables/columns if missing)
  // We use alter: true so it adds the PostGIS 'location' column to users/groups safely
  await db.sequelize.sync({ alter: true });
  console.log('Database synchronized.');

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
