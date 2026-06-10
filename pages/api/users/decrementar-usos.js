import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID requerido' });
    }

    await connectDB();

    // Buscar usuario y decrementar usos
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Decrementar solo si hay usos disponibles
    if (user.usosHoyRestantes > 0) {
      user.usosHoyRestantes -= 1;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      usosHoyRestantes: user.usosHoyRestantes,
    });
  } catch (error) {
    console.error('Error decrementando usos:', error);
    return res.status(500).json({
      error: 'Error al decrementar usos',
      details: error.message,
    });
  }
}
