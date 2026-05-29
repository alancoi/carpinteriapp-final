import connectDB from '@/lib/mongodb';
import Contacto from '@/models/Contacto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, email, mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    await connectDB();

    const newContact = await Contacto.create({
      userId: userId || null,
      email: email || null,
      mensaje,
      tipo: 'error',
    });

    return res.status(201).json({
      success: true,
      message: 'Reporte enviado exitosamente',
      contact: newContact,
    });
  } catch (error) {
    console.error('Error guardando contacto:', error);
    return res.status(500).json({
      error: 'Error guardando reporte',
      details: error.message,
    });
  }
}
