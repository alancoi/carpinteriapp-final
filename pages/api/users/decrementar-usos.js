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
    console.log('📊 decrementar-usos called with userId:', userId);

    if (!userId) {
      console.error('❌ No userId provided');
      return res.status(400).json({ error: 'User ID requerido' });
    }

    // Buscar usuario en Supabase
    console.log('🔍 Buscando usuario:', userId);
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      console.error('❌ Usuario no encontrado:', userId);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('👤 Usuario encontrado:', user.id);

    // Verificar si debe resetear usos (cada 24 horas)
    const ahora = new Date();
    const ultimoReset = new Date(user.ultimo_reset_usos || user.created_at);
    const diff = ahora - ultimoReset;
    const hours = diff / (1000 * 60 * 60);

    console.log('⏰ Horas desde último reset:', hours);
    let usosActuales = user.usos_hoy_restantes;

    if (hours >= 24) {
      console.log('🔄 Reseteando usos a 20');
      usosActuales = 20;
      const { error: updateError } = await supabase
        .from('users')
        .update({
          usos_hoy_restantes: 20,
          ultimo_reset_usos: ahora.toISOString(),
          updated_at: ahora.toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error reseteando usos:', updateError);
        return res.status(500).json({ error: 'Error reseteando usos' });
      }
    }

    // Decrementar solo si hay usos disponibles
    const usosAntes = usosActuales;
    if (usosActuales > 0) {
      usosActuales -= 1;
      console.log('📉 Usos decrementados:', usosAntes, '→', usosActuales);

      const { error: updateError } = await supabase
        .from('users')
        .update({
          usos_hoy_restantes: usosActuales,
          updated_at: ahora.toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error decrementando usos:', updateError);
        return res.status(500).json({ error: 'Error decrementando usos' });
      }

      console.log('💾 Usuario actualizado en BD');
    } else {
      console.warn('⚠️ No hay usos disponibles');
    }

    console.log('✅ Respondiendo con usosHoyRestantes:', usosActuales);
    return res.status(200).json({
      success: true,
      usosHoyRestantes: usosActuales,
    });
  } catch (error) {
    console.error('❌ Error decrementando usos:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      error: 'Error al decrementar usos',
      details: error.message,
    });
  }
}
