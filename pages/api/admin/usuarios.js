import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await connectDB();

    const usuarios = await User.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      usuarios: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({
      error: 'Error obteniendo usuarios',
      details: error.message,
    });
  }
}
