exports.crearVisita = async (req, res) => {
    try {
      const { propiedad, cliente, fecha, hora } = req.body;
      
      const nuevaVisita = await Visita.create({
        propiedad,
        cliente,
        fecha: new Date(fecha),
        hora,
        creadoPor: req.userId // Asume autenticación JWT
      });
  
      res.status(201).json({
        message: 'Visita programada exitosamente',
        visita: nuevaVisita
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Error al programar visita',
        details: error.message 
      });
    }
  };