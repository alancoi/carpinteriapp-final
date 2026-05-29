import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateRandomPassword } from '@/lib/password';
import bcryptjs from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email, plan = 'premium', paymentId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    await connectDB();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'El email ya está registrado',
        userId: existingUser._id,
      });
    }

    // Generar contraseña aleatoria
    const randomPassword = generateRandomPassword(12);
    const hashedPassword = await bcryptjs.hash(randomPassword, 10);

    // Crear usuario
    const newUser = await User.create({
      email,
      password: hashedPassword,
      plan: plan || 'premium',
      proyectosGuardados: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario creado automáticamente',
      user: {
        id: newUser._id,
        email: newUser.email,
        plan: newUser.plan,
        tempPassword: randomPassword, // Mostrar solo una vez
      },
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    return res.status(500).json({
      error: 'Error creando usuario',
      details: error.message,
    });
  }
}
