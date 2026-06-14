import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId requerido' });
    }

    const { data: projects, error: fetchError } = await supabase
      .from('proyectos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error obteniendo proyectos:', fetchError);
      return res.status(500).json({
        error: 'Error obteniendo proyectos',
        details: fetchError.message,
      });
    }

    return res.status(200).json({
      success: true,
      projects: projects || [],
      count: (projects || []).length,
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    return res.status(500).json({
      error: 'Error obteniendo proyectos',
      details: error.message,
    });
  }
}
