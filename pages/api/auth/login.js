import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email, password } = req.body;

    console.log('🔐 Login intento:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    await connectDB();
    console.log('✅ MongoDB conectado');

    const db = mongoose.connection.db;
    
    // Buscar usuario directamente en MongoDB
    console.log('🔍 Buscando usuario:', email);
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    console.log('✅ Usuario encontrado');
    console.log('🔐 Verificando contraseña...');

    // Verificar contraseña
    if (!user.password) {
      console.log('❌ Usuario sin contraseña');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    console.log('✅ Contraseña correcta');

    // Verificar si debe resetear usos (cada 24 horas)
    const ahora = new Date();
    const ultimoReset = new Date(user.ultimoResetUsos || user.createdAt);
    const diff = ahora - ultimoReset;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours >= 24) {
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: {
          usosHoyRestantes: 20,
          ultimoResetUsos: ahora
        }}
      );
      console.log('🔄 Usos resetados');
    }

    console.log('✅ Login exitoso');

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        email: user.email,
        plan: user.plan || 'basico',
        usosHoyRestantes: user.usosHoyRestantes || 20,
      },
    });
  } catch (error) {
    console.error('❌ ERROR LOGIN:', error.message);
    console.error('Stack:', error.stack);
    
    return res.status(500).json({
      error: 'Error en login',
      details: error.message,
    });
  }
}
