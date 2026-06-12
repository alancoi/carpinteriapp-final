import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = req.body;
    console.log('📊 decrementar-usos called with userId:', userId);

    if (!userId) {
      console.error('❌ No userId provided');
      return res.status(400).json({ error: 'User ID requerido' });
    }

    console.log('🔗 Conectando a MongoDB...');
    await connectDB();
    console.log('✅ MongoDB conectado');

    // Buscar usuario y decrementar usos
    console.log('🔍 Buscando usuario:', userId);
    const user = await User.findById(userId);
    console.log('👤 Usuario encontrado:', user ? user._id : 'NO');
    
    if (!user) {
      console.error('❌ Usuario no encontrado:', userId);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si debe resetear usos (cada 24 horas)
    const ahora = new Date();
    const ultimoReset = new Date(user.ultimoResetUsos || user.createdAt);
    const diff = ahora - ultimoReset;
    const hours = diff / (1000 * 60 * 60);
    
    console.log('⏰ Horas desde último reset:', hours);
    if (hours >= 24) {
      console.log('🔄 Reseteando usos a 20');
      user.usosHoyRestantes = 20;
      user.ultimoResetUsos = ahora;
    }

    // Decrementar solo si hay usos disponibles
    const usosAntes = user.usosHoyRestantes;
    if (user.usosHoyRestantes > 0) {
      user.usosHoyRestantes -= 1;
      console.log('📉 Usos decrementados:', usosAntes, '→', user.usosHoyRestantes);
      await user.save();
      console.log('💾 Usuario guardado en BD');
    } else {
      console.warn('⚠️ No hay usos disponibles');
    }

    console.log('✅ Respondiendo con usosHoyRestantes:', user.usosHoyRestantes);
    return res.status(200).json({
      success: true,
      usosHoyRestantes: user.usosHoyRestantes,
    });
  } catch (error) {
    console.error('❌ Error decrementando usos:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: 'Error al decrementar usos',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
