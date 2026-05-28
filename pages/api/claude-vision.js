import crypto from 'crypto';

// Cache en memoria para esta sesión
const analysisCache = {};

function getImageHash(imageBase64) {
  return crypto.createHash('sha256').update(imageBase64).digest('hex');
}

function isImageResolutionValid(imageBase64) {
  const sizeInBytes = Buffer.byteLength(imageBase64, 'base64');
  return sizeInBytes > 20000; // Mínimo ~480x480
}

async function analyzeWithModel(imageBase64) {
  const apiKey = process.env.CLAUDE_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 segundos

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
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
                text: `VERIFICA PRIMERO si esta imagen es un mueble de madera/carpintería de BUENA CALIDAD.

SI NO es un mueble: Responde SOLO: "❌ ERROR: Esta no es una imagen de un mueble o carpintería. Por favor, sube una foto clara de un mueble de madera."

SI la imagen es BORROSA, oscura o de mala calidad: Responde SOLO: "⚠️ CALIDAD BAJA: La imagen no tiene suficiente claridad. Por favor, busca una foto con mejor iluminación y resolución para obtener un análisis exacto."

SI la imagen está muy inclinada o de lado: Responde SOLO: "📐 PERSPECTIVA: Por favor, toma la foto de frente y lo más perpendicular posible al mueble para obtener medidas exactas."

SI es un mueble de BUENA CALIDAD: Analiza y proporciona EXACTAMENTE esto (EN ESTE ORDEN):

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

4. LISTA DETALLADA DE MATERIALES:
   TABLEROS: tipo, espesor, m² o piezas
   HERRAJES: bisagras (qty/tipo), guías (qty/largo), soportes
   TORNILLOS EXACTOS: 3.5x50mm X unidades, 3.5x35mm X, etc
   OTROS: cola, lijas, sellador

5. PASOS DE ARMADO (5-7 pasos):
   Cada paso: nombre, piezas con medidas, procedimiento

6. TIEMPO ESTIMADO:
   Preparación (h), ensamble (h), acabado (h), TOTAL

SÉ ESPECÍFICO Y EXACTO.`,
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en API');
    }

    const analysis =
      data.content && data.content[0] && data.content[0].type === 'text'
        ? data.content[0].text
        : '';

    return { success: true, analysis };
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('TIMEOUT: El análisis tardó demasiado. Intenta con una imagen más clara.');
    }
    throw error;
  }
}

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
      return res.status(500).json({ error: 'API key no configurada' });
    }

    // 1. VALIDACIÓN DE RESOLUCIÓN
    if (!isImageResolutionValid(imageBase64)) {
      return res.status(400).json({
        error: '📷 Imagen muy pequeña',
        message: 'La imagen tiene muy baja resolución. Por favor, usa una foto de al menos 480x480 píxeles.',
      });
    }

    // 2. CACHE DE IMÁGENES
    const imageHash = getImageHash(imageBase64);
    if (analysisCache[imageHash]) {
      console.log('📦 Análisis desde caché:', imageHash);
      return res.status(200).json({
        success: true,
        analysis: analysisCache[imageHash].analysis,
        cached: true,
      });
    }

    // 3. ANÁLISIS CON SONNET
    console.log('🔍 Analizando con Sonnet...');
    const result = await analyzeWithModel(imageBase64);

    // 4. VALIDACIÓN FINAL
    if (!result.analysis || result.analysis.trim().length === 0) {
      return res.status(400).json({
        error: '❌ No se pudo analizar',
        message: 'No se pudo procesar la imagen. Por favor, intenta con una foto más clara del mueble.',
      });
    }

    // 5. GUARDAR EN CACHÉ
    analysisCache[imageHash] = {
      analysis: result.analysis,
      timestamp: Date.now(),
    };

    // Limpiar caché antiguo (más de 1 hora)
    Object.keys(analysisCache).forEach((key) => {
      if (Date.now() - analysisCache[key].timestamp > 3600000) {
        delete analysisCache[key];
      }
    });

    return res.status(200).json({
      success: true,
      analysis: result.analysis,
      cached: false,
    });
  } catch (error) {
    console.error('Error en Claude Vision API:', error);

    let errorMessage = 'Error procesando imagen';
    if (error.message.includes('TIMEOUT')) {
      errorMessage = '⏱️ ' + error.message;
    } else if (error.message.includes('invalid x-api-key')) {
      errorMessage = '🔐 Error de autenticación de API';
    }

    return res.status(500).json({
      error: errorMessage,
      details: error.message,
    });
  }
}
