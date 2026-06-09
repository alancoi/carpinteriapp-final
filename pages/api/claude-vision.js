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
                text: `⚠️ IMPORTANTE: Las medidas que proporciones son APROXIMADAS en CENTÍMETROS, basadas exclusivamente en la imagen enviada. Para medidas exactas, se recomienda verificar con un instrumento de medición en persona.

Verifica si esta imagen es un mueble de BUENA CALIDAD.

SI NO mueble: "❌ No es mueble. Sube foto clara."
SI borroso/oscuro: "⚠️ Imagen borrosa. Mejor iluminacion y resolucion."
SI inclinado: "📐 Foto inclinada. Tomala de frente."

SI BUENA CALIDAD, proporciona EXACTAMENTE en este orden (TODO EN ESPAÑOL, sin palabras en ingles):

## 1. DIMENSIONES (cm)

╔═════════════════════╦═════════════════╗
║  Medida             ║  Valor          ║
╠═════════════════════╬═════════════════╣
║  Ancho              ║  XX cm          ║
║  Alto               ║  XX cm          ║
║  Profundidad        ║  XX cm          ║
║  Espesor placa      ║  XX mm          ║
╚═════════════════════╩═════════════════╝

*Componentes:* lista de partes principales

## 2. PLANO ASCII (8-12 lineas max)
Diagrama frontal simple con medidas principales

## 3. CORTES PLACA 275x183cm

╔═════════════════╦═══════╦═════════╦═════════╦═══════════╗
║  Pieza          ║  Qty  ║  Largo  ║  Ancho  ║  cm²      ║
╠═════════════════╬═══════╬═════════╬═════════╬═══════════╣
║  Tapa mesa      ║  1    ║  140    ║  70     ║  9.800    ║
║  ...            ║  ..   ║  ...    ║  ...    ║  ...      ║
╚═════════════════╩═══════╩═════════╩═════════╩═══════════╝

Calculo desperdicio:
╔═══════════════════════╦════════════════╗
║  Concepto             ║  Valor         ║
╠═══════════════════════╬════════════════╣
║  Area total placa     ║  50.325 cm²    ║
║  Area usada           ║  XX cm²        ║
║  Desperdicio          ║  XX% / XX cm²  ║
╚═══════════════════════╩════════════════╝

## 4. MATERIALES EXACTOS
Tableros: tipo, cantidad, medidas
Herrajes: tipo y cantidad (pines, tacos, etc)
Tornillos: tipo con medida exacta, cantidad
Clavos: tipo, cantidad
Cantos: material, cantidad ml
Adhesivos: tipo, cantidad

## 5. NOTAS IMPORTANTES
3-5 puntos criticos: cuidados, tolerancias, verificaciones, detalles importantes

REGLAS ESTRICTAS:
- TODO EN ESPAÑOL, sin ingles
- Tablas con bordes Unicode (╔ ╚ ║ ═ ╠ etc) - NUNCA rotos
- Espacios GENEROSOS dentro de celdas (padding)
- Columnas NUNCA se salen del cuadro
- Bordes SIEMPRE perfectamente alineados
- Se conciso pero EXACTO`,
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
