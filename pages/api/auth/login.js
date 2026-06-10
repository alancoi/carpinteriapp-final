import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    await connectDB();

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const passwordMatch = await bcryptjs.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Verificar si debe resetear usos (cada 24 horas)
    const ahora = new Date();
    const ultimoReset = new Date(user.ultimoResetUsos || user.createdAt);
    const diff = ahora - ultimoReset;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours >= 24) {
      user.usosHoyRestantes = 20;
      user.ultimoResetUsos = ahora;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        plan: user.plan,
        usosHoyRestantes: user.usosHoyRestantes || 20,
        proyectosGuardados: user.proyectosGuardados,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      error: 'Error en login',
      details: error.message,
    });
  }
}

