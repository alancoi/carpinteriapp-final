import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import ImageCache from '@/models/ImageCache';

const analysisCache = {};

function getImageHash(imageBase64) {
  return crypto.createHash('sha256').update(imageBase64).digest('hex');
}

function isImageResolutionValid(imageBase64) {
  const sizeInBytes = Buffer.byteLength(imageBase64, 'base64');
  return sizeInBytes > 20000;
}

async function analyzeWithModel(imageBase64, mimeType = 'image/jpeg') {
  const apiKey = process.env.CLAUDE_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  // Prompt que será cacheado
  const analysisPrompt = `ANALIZA ESTA IMAGEN DE MUEBLE CON MÁXIMA PRECISIÓN.

INSTRUCCIONES CRÍTICAS:
- Identifica QUÉ mueble es REALMENTE (mesa, armario, estante, silla, escritorio, etc)
- Analiza la forma, estructura, componentes visibles
- Extrae medidas visuales aproximadas pero REALISTAS
- Devuelve SOLO JSON en UNA ÚNICA LÍNEA, SIN SALTOS DE LÍNEA, sin explicaciones

SI NO es mueble: {"error":"No es mueble o imagen inapropiada"}

SI ES MUEBLE, devuelve JSON EXACTO en UNA SOLA LÍNEA (sin \\n, sin espacios extras):
{"tipo_mueble":"[TIPO REAL que VES]","estilo":"[estilo visual]","medidas":{"largo":[número],"ancho":[número],"alto":[número]},"materiales":[{"nombre":"[material]","cantidad":"[cantidad]"}],"componentes":[{"nombre":"[nombre componente]","cantidad":[num],"medidas":"[medidas]","espesor":"[espesor o N/A]"}],"cortes":[{"componente":"[nombre]","medidas":"[L×A]","cantidad":[num],"desperdicio":"[%]"}],"desperdicio_total":"[%]","notas":["[nota técnica 1]","[nota técnica 2]","[nota técnica 3]"]}

IMPORTANTE:
- ANALIZA LA IMAGEN REALMENTE, no uses plantillas
- El tipo_mueble debe coincidir CON LO QUE VES en la foto
- Las medidas deben ser realistas para ese tipo de mueble
- Los componentes deben ser los VISIBLES en la imagen
- RESPONDE SOLO CON EL JSON, NADA MÁS`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt,
                cache_control: { type: 'ephemeral' },
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64,
                },
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
      throw new Error('El analisis tardo demasiado. Intenta con una imagen mas clara o espera unos momentos.');
    }
    throw error;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key no configurada' });
    }

    if (!isImageResolutionValid(imageBase64)) {
      return res.status(400).json({
        error: '📷 Imagen muy pequeña',
        message: 'Usa una foto de al menos 480x480 pixeles.',
      });
    }

    const imageHash = getImageHash(imageBase64);
    
    // PRIMERO: Buscar en caché en memoria (rápido)
    if (analysisCache[imageHash]) {
      return res.status(200).json({
        success: true,
        analysis: analysisCache[imageHash].analysis,
        cached: true,
        cacheType: 'memory',
      });
    }

    // SEGUNDO: Buscar en MongoDB (caché persistente)
    try {
      await connectDB();
      const cachedResult = await ImageCache.findOne({ hash: imageHash });
      
      if (cachedResult) {
        // Guardar también en caché en memoria para próximas veces
        analysisCache[imageHash] = {
          analysis: cachedResult.analisis,
          timestamp: Date.now(),
        };
        
        return res.status(200).json({
          success: true,
          analysis: typeof cachedResult.analisis === 'string' ? cachedResult.analisis : JSON.stringify(cachedResult.analisis),
          cached: true,
          cacheType: 'database',
        });
      }
    } catch (dbError) {
      console.error('Error buscando en DB caché:', dbError);
      // Continuar sin caché si falla BD
    }

    // TERCERO: Si no está en caché, analizar con Claude
    const result = await analyzeWithModel(imageBase64, mimeType);

    if (!result.analysis || result.analysis.trim().length === 0) {
      return res.status(400).json({
        error: '❌ No se pudo analizar',
        message: 'Intenta con una foto mas clara del mueble.',
      });
    }

    // Guardar en caché en memoria
    analysisCache[imageHash] = {
      analysis: result.analysis,
      timestamp: Date.now(),
    };

    // Limpiar caché en memoria (máximo 100 items)
    Object.keys(analysisCache).forEach((key) => {
      if (Date.now() - analysisCache[key].timestamp > 3600000) {
        delete analysisCache[key];
      }
    });

    // Guardar en MongoDB (caché persistente)
    try {
      await connectDB();
      const analysisObj = JSON.parse(result.analysis);
      
      await ImageCache.updateOne(
        { hash: imageHash },
        {
          hash: imageHash,
          analisis: analysisObj,
          createdAt: new Date(),
        },
        { upsert: true }
      );
    } catch (dbError) {
      console.error('Error guardando en DB caché:', dbError);
      // Continuar sin guardar si falla
    }

    return res.status(200).json({
      success: true,
      analysis: result.analysis,
      cached: false,
    });
  } catch (error) {
    console.error('Error en claude-vision:', error.message);
    const errorMessage = error.message ? error.message.substring(0, 200) : 'Error desconocido';
    return res.status(500).json({
      success: false,
      error: 'Error procesando imagen',
      message: errorMessage,
    });
  }
}
