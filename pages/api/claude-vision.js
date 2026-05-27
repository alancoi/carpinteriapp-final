export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key no configurada en variables de entorno' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `ANALIZA ESTA IMAGEN DE MUEBLE/CARPINTERÍA CON MÁXIMO DETALLE.

DEBES PROPORCIONAR EXACTAMENTE ESTO (EN ESTE ORDEN):

1. DIMENSIONES EXACTAS DEL MUEBLE:
   - Ancho total (cm), Alto total (cm), Profundidad (cm)
   - Espesor laterales (mm), Espesor divisiones (mm)
   - Altura cada compartimento/cajón (cm)

2. PLANO TÉCNICO ASCII:
   Dibuja frente del mueble con medidas exactas.

3. CORTES DE PLACAS ENTERAS (MUY IMPORTANTE):
   De placas 275cm x 183cm (50.325 m²), cómo cortar exactamente:
   Para CADA placa especifica:
   - Qué piezas se cortan
   - Medidas exactas de cada pieza
   - Cantidad de piezas
   - DESPERDICIO: en % + en cm² + en m²
   Ejemplo: "Desperdicio 15% = 7.550 cm² = 0.75 m²"

4. LISTA DETALLADA DE MATERIALES:
   TABLEROS: tipo, espesor, m² o piezas
   HERRAJES: bisagras (qty/tipo), guías (qty/largo), soportes
   TORNILLOS EXACTOS: 3.5x50mm X unidades, 3.5x35mm X, etc
   OTROS: cola, lijas, sellador

5. PASOS DE ARMADO (7-10 pasos):
   Cada paso: nombre, piezas con medidas, cantidad de tornillos exacta, procedimiento

6. TIEMPO ESTIMADO:
   Preparación (h), ensamble (h), acabado (h), TOTAL

SÉ ESPECÍFICO Y EXACTO. NO DEJES NADA AL AZAR.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Error en Claude API',
        details: data.error?.message || 'Error desconocido',
      });
    }

    const analysis =
      data.content && data.content[0] && data.content[0].type === 'text'
        ? data.content[0].text
        : '';

    return res.status(200).json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error('Error en Claude Vision API:', error);
    return res.status(500).json({
      error: 'Error procesando imagen',
      details: error.message,
    });
  }
}
// Trigger rebuild with env vars - Wed May 27 15:50:07 UTC 2026
