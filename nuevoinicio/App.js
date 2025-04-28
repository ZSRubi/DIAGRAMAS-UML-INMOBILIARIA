// const express = require('express');
// const path = require('path');
// const connectDB = require('./database/connection');
// const userRoutes = require('./routers/userRouters');

// const app = express();
// const PORT = 3000;

// connectDB();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/usuarios', userRoutes);


// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`✅ Servidor activo en http://localhost:${PORT}`);
// });


// // Agrega estas líneas donde configuras tus rutas
// const propertyRoutes = require('./routers/propiedadRouters');
// app.use('/api/properties', propertyRoutes);

// // Para servir archivos estáticos
// app.use('/uploads', express.static('uploads'));

const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./database/connection');
const userRoutes = require('./routers/userRouters');
const Message = require('./models/Message');  // Asegúrate de importar el modelo de mensaje
const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = socketIo(server);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', userRoutes);

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado:', socket.id);

  let userRole = ''; // Role del usuario
  let userId = '';   // ID del usuario

  socket.on('set-role', (data) => {
    userRole = data.role;
    userId = data.id;
    console.log(`${userRole} conectado con ID ${userId}`);
  });

  // Cuando se recibe un mensaje, lo redirige según el rol del remitente
  socket.on('send-message', async (data) => {
    const { message, isToAdmin } = data;
    const newMessage = new Message({
      from: userRole,
      message,
      timestamp: new Date()
    });

    // Guardar el mensaje en la base de datos
    await newMessage.save();

    // Emitir el mensaje a la sala correspondiente según el rol
    if (userRole === 'cliente') {
      // Cliente → Agente
      io.to('agente-room').emit('new-message', newMessage);
    } else if (userRole === 'agente') {
      if (isToAdmin) {
        // Agente → Administrador
        io.to('administrador-room').emit('new-message', newMessage);
      } else {
        // Agente → Cliente
        io.to('cliente-room').emit('new-message', newMessage);
      }
    } else if (userRole === 'administrador') {
      // Administrador → Agente
      io.to('agente-room').emit('new-message', newMessage);
    }
  });

  // Cuando el usuario se desconecta
  socket.on('disconnect', () => {
    console.log(`${userRole} desconectado: ${socket.id}`);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Cambia app.listen por server.listen
server.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});

// Rutas de propiedades
const propertyRoutes = require('./routers/propiedadRouters');
app.use('/api/properties', propertyRoutes);

// Para servir archivos estáticos
app.use('/uploads', express.static('uploads'));
