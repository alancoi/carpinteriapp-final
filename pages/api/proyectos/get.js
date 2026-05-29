import connectDB from '@/lib/mongodb';
import Proyecto from '@/models/Proyecto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId requerido' });
    }

    await connectDB();

    const projects = await Proyecto.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      projects: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    return res.status(500).json({
      error: 'Error obteniendo proyectos',
      details: error.message,
    });
  }
}
