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
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Por favor completa todos los campos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Crear usuario
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        nombre,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        plan: 'basico',
        usos_hoy_restantes: 20,
        payment_status: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creando usuario:', createError);
      return res.status(500).json({
        error: 'Error registrando usuario',
        details: createError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        plan: newUser.plan,
      },
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return res.status(500).json({
      error: 'Error registrando usuario',
      details: error.message,
    });
  }
}
