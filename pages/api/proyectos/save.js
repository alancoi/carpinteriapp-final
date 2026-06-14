import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, name, date, analysis, preview, description } = req.body;

    if (!userId || !name || !analysis) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const { data: newProject, error: createError } = await supabase
      .from('proyectos')
      .insert({
        user_id: userId,
        name,
        date: date || new Date().toISOString(),
        analysis,
        preview,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error guardando proyecto:', createError);
      return res.status(500).json({
        error: 'Error guardando proyecto',
        details: createError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Proyecto guardado exitosamente',
      project: newProject,
    });
  } catch (error) {
    console.error('Error guardando proyecto:', error);
    return res.status(500).json({
      error: 'Error guardando proyecto',
      details: error.message,
    });
  }
}
