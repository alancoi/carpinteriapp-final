import crypto from 'crypto';

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
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: `Analiza esta imagen de un mueble y devuelve SOLO UN JSON en UNA SOLA LÍNEA.

SI NO es mueble o está borroso/inclinado: {"error":"[mensaje apropiado]"}

SI es mueble de buena calidad, DEVUELVE JSON PURO (sin explicaciones, sin saltos de línea):
{"tipo_mueble":"[tipo exacto]","estilo":"[estilo]","medidas":{"largo":[número],"ancho":[número],"alto":[número]},"materiales":[{"nombre":"[material]","cantidad":"[cantidad con unidad]"}],"componentes":[{"nombre":"[componente]","cantidad":[número],"medidas":"[L×A cm]","espesor":"[espesor cm]"}],"cortes":[{"componente":"[nombre]","medidas":"[L×A cm]","cantidad":[número],"desperdicio":"[%]"}],"desperdicio_total":"[rango%]","notas":["[nota 1 práctica]","[nota 2 práctica]","[nota 3 práctica]"]}

IMPORTANTE: Analiza REALMENTE la foto, extrae medidas aproximadas visuales, lista TODOS los componentes visibles, calcula desperdicio realista.`,
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
    if (analysisCache[imageHash]) {
      return res.status(200).json({
        success: true,
        analysis: analysisCache[imageHash].analysis,
        cached: true,
      });
    }

    const result = await analyzeWithModel(imageBase64, mimeType);

    if (!result.analysis || result.analysis.trim().length === 0) {
      return res.status(400).json({
        error: '❌ No se pudo analizar',
        message: 'Intenta con una foto mas clara del mueble.',
      });
    }

    analysisCache[imageHash] = {
      analysis: result.analysis,
      timestamp: Date.now(),
    };

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
    console.error('Error en claude-vision:', error.message);
    const errorMessage = error.message ? error.message.substring(0, 200) : 'Error desconocido';
    return res.status(500).json({
      success: false,
      error: 'Error procesando imagen',
      message: errorMessage,
    });
  }
}
