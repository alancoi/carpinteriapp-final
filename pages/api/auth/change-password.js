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
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Buscar usuario
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Actualizar contraseña en BD
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError);
      return res.status(500).json({
        error: 'Error cambiando contraseña',
        details: updateError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    return res.status(500).json({
      error: error.message || 'Error cambiando contraseña',
    });
  }
}
