import connectDB from '@/lib/mongodb';
import Calificacion from '@/models/Calificacion';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, email, estrellas, opinion, mejoras } = req.body;

    if (!estrellas || estrellas < 1 || estrellas > 5) {
      return res.status(400).json({ error: 'Las estrellas deben estar entre 1 y 5' });
    }

    await connectDB();

    const newRating = await Calificacion.create({
      userId: userId || null,
      email: email || null,
      estrellas,
      opinion: opinion || '',
      mejoras: mejoras || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Calificación guardada exitosamente',
      rating: newRating,
    });
  } catch (error) {
    console.error('Error guardando calificación:', error);
    return res.status(500).json({
      error: 'Error guardando calificación',
      details: error.message,
    });
  }
}
