import { createClient } from '@supabase/supabase-js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateRandomPassword(length = 12) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email, plan = 'premium', paymentId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({
        error: 'El email ya está registrado',
        userId: existingUser.id,
      });
    }

    // Generar contraseña aleatoria
    const randomPassword = generateRandomPassword(12);
    const hashedPassword = await bcryptjs.hash(randomPassword, 10);

    // Crear usuario
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        plan: plan || 'premium',
        usos_hoy_restantes: plan === 'premium' ? 1000 : 20,
        payment_status: 'pagado',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creando usuario:', createError);
      return res.status(500).json({
        error: 'Error creando usuario',
        details: createError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Usuario creado automáticamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        plan: newUser.plan,
        tempPassword: randomPassword, // Mostrar solo una vez
      },
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    return res.status(500).json({
      error: error.message || 'Error creando usuario',
      details: error.toString(),
    });
  }
}
