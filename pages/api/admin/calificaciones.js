import connectDB from '@/lib/mongodb';
import Calificacion from '@/models/Calificacion';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await connectDB();

    const calificaciones = await Calificacion.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      calificaciones: calificaciones,
      total: calificaciones.length,
      promedio: calificaciones.length > 0
        ? (calificaciones.reduce((sum, c) => sum + c.estrellas, 0) / calificaciones.length).toFixed(1)
        : 0,
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones:', error);
    return res.status(500).json({
      error: 'Error obteniendo calificaciones',
      details: error.message,
    });
  }
}
