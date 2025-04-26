const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  propiedad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true,
    enum: ['09:00', '10:00', '11:00', '15:00', '16:00']
  },
  estado: {
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'completada', 'cancelada']
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Visita', visitaSchema);