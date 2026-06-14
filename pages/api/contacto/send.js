import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { userId, email, mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    const { data: newContact, error: createError } = await supabase
      .from('contactos')
      .insert({
        user_id: userId || null,
        email: email || null,
        mensaje,
        tipo: 'error',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error guardando contacto:', createError);
      return res.status(500).json({
        error: 'Error guardando reporte',
        details: createError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Reporte enviado exitosamente',
      contact: newContact,
    });
  } catch (error) {
    console.error('Error guardando contacto:', error);
    return res.status(500).json({
      error: 'Error guardando reporte',
      details: error.message,
    });
  }
}
