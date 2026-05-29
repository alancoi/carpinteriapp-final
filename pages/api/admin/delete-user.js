import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    await connectDB();

    // Eliminar usuario
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente',
      email: deletedUser.email,
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return res.status(500).json({
      error: error.message || 'Error eliminando usuario',
    });
  }
}
