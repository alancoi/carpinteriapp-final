import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId requerido' });
    }

    const { data: deletedProject, error: deleteError } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', projectId)
      .select()
      .single();

    if (deleteError || !deletedProject) {
      console.error('Proyecto no encontrado o error:', deleteError);
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    return res.status(200).json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    return res.status(500).json({
      error: 'Error eliminando proyecto',
      details: error.message,
    });
  }
}
