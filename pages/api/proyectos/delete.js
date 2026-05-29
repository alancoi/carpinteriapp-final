import connectDB from '@/lib/mongodb';
import Proyecto from '@/models/Proyecto';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId requerido' });
    }

    await connectDB();

    const deletedProject = await Proyecto.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    return res.status(500).json({
      error: 'Error eliminando proyecto',
      details: error.message,
    });
  }
}
