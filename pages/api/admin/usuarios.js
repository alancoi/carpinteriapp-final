import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { data: usuarios, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error obteniendo usuarios:', fetchError);
      return res.status(500).json({
        error: 'Error obteniendo usuarios',
        details: fetchError.message,
      });
    }

    return res.status(200).json({
      success: true,
      usuarios: usuarios || [],
      total: (usuarios || []).length,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({
      error: 'Error obteniendo usuarios',
      details: error.message,
    });
  }
}
