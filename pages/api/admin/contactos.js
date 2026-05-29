import connectDB from '@/lib/mongodb';
import Contacto from '@/models/Contacto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await connectDB();

    const contactos = await Contacto.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      contactos: contactos,
      total: contactos.length,
    });
  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    return res.status(500).json({
      error: 'Error obteniendo contactos',
      details: error.message,
    });
  }
}
