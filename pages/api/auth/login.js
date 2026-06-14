import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Buscar usuario en Supabase
    console.log('🔍 Buscando usuario:', email);
    const { data: user, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (searchError || !user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    console.log('✅ Usuario encontrado');
    console.log('🔐 Verificando contraseña...');

    // Verificar contraseña
    if (!user.password_hash) {
      console.log('❌ Usuario sin contraseña');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const passwordMatch = await bcryptjs.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    console.log('✅ Contraseña correcta');

    // Verificar si debe resetear usos (cada 24 horas)
    const ahora = new Date();
    const ultimoReset = new Date(user.ultimo_reset_usos || user.created_at);
    const diff = ahora - ultimoReset;
    const hours = diff / (1000 * 60 * 60);

    if (hours >= 24) {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          usos_hoy_restantes: 20,
          ultimo_reset_usos: ahora.toISOString(),
        })
        .eq('id', user.id);

      if (!updateError) {
        console.log('🔄 Usos resetados');
      }
    }

    console.log('✅ Login exitoso');

    return res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan || 'basico',
        usosHoyRestantes: user.usos_hoy_restantes || 20,
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
