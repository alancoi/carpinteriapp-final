import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { data: calificaciones, error: fetchError } = await supabase
      .from('calificaciones')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error obteniendo calificaciones:', fetchError);
      return res.status(500).json({
        error: 'Error obteniendo calificaciones',
        details: fetchError.message,
      });
    }

    const califs = calificaciones || [];
    const promedio = califs.length > 0
      ? (califs.reduce((sum, c) => sum + c.estrellas, 0) / califs.length).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      calificaciones: califs,
      total: califs.length,
      promedio: promedio,
    });
  } catch (error) {
    console.error('Error obteniendo calificaciones:', error);
    return res.status(500).json({
      error: 'Error obteniendo calificaciones',
      details: error.message,
    });
  }
}
