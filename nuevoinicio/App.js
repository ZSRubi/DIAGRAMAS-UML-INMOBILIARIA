const express = require('express');
const path = require('path');
const connectDB = require('./database/connection');
const userRoutes = require('./routers/userRouters');

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', userRoutes);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});


// Agrega estas líneas donde configuras tus rutas
const propertyRoutes = require('./routers/propiedadRouters');
app.use('/api/properties', propertyRoutes);

// Para servir archivos estáticos
app.use('/uploads', express.static('uploads'));