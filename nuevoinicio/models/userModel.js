const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  password: String,
  rol: String // admin, agente, cliente
});

module.exports = mongoose.model('Usuario', userSchema);


userModel.js
