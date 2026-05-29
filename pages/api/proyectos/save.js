import connectDB from '@/lib/mongodb';
import Proyecto from '@/models/Proyecto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, name, date, analysis, preview, description } = req.body;

    if (!userId || !name || !analysis) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    await connectDB();

    const newProject = await Proyecto.create({
      userId,
      name,
      date,
      analysis,
      preview,
      description,
    });

    return res.status(201).json({
      success: true,
      message: 'Proyecto guardado exitosamente',
      project: newProject,
    });
  } catch (error) {
    console.error('Error guardando proyecto:', error);
    return res.status(500).json({
      error: 'Error guardando proyecto',
      details: error.message,
    });
  }
}
