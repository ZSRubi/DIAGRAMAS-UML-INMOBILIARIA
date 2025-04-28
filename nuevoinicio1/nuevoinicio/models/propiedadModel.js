const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  address: { type: String, required: true },
  type: { type: String, enum: ['Casa', 'Departamento', 'Oficina', 'Terreno'], required: true },
  price: { type: Number, required: true },
  photos: [String], // Array de URLs de imágenes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);