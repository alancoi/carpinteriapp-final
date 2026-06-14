import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    // Obtener email antes de eliminar
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar usuario
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('Error eliminando usuario:', deleteError);
      return res.status(500).json({
        error: 'Error eliminando usuario',
        details: deleteError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente',
      email: user.email,
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return res.status(500).json({
      error: error.message || 'Error eliminando usuario',
    });
  }
}
