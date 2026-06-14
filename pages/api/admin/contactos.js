import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { data: contactos, error: fetchError } = await supabase
      .from('contactos')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error obteniendo contactos:', fetchError);
      return res.status(500).json({
        error: 'Error obteniendo contactos',
        details: fetchError.message,
      });
    }

    return res.status(200).json({
      success: true,
      contactos: contactos || [],
      total: (contactos || []).length,
    });
  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    return res.status(500).json({
      error: 'Error obteniendo contactos',
      details: error.message,
    });
  }
}
