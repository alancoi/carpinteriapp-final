import crypto from 'crypto';

// Cache en memoria para esta sesión
const analysisCache = {};

function getImageHash(imageBase64) {
  return crypto.createHash('sha256').update(imageBase64).digest('hex');
}

function isImageResolutionValid(imageBase64) {
  const sizeInBytes = Buffer.byteLength(imageBase64, 'base64');
  return sizeInBytes > 20000;
}

async function analyzeWithModel(imageBase64) {
  const apiKey = process.env.CLAUDE_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60 segundos

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
        max_tokens: 3500,
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
                text: `Verifica si esta imagen es un mueble de BUENA CALIDAD.

SI NO mueble: "❌ No es mueble. Sube foto clara."
SI borroso/oscuro: "⚠️ Imagen borrosa. Mejor iluminacion."
SI inclinado: "📐 Foto inclinada. Tomala de frente."

SI BUENA CALIDAD, proporciona EN ESTE ORDEN:

## 1. DIMENSIONES (cm)
Ancho | Alto | Profundidad | Espesor placa | Detalles componentes

## 2. PLANO ASCII FRONTAL
Diagrama tecnico simple con medidas

## 3. CORTES PLACA 275x183cm
- Tabla con piezas: Nombre | Cantidad | Largo | Ancho
- Calculo: Area total | Area usada | Desperdicio (cm2 y %)

## 4. MATERIALES
TABLEROS: tipo, cantidad, medidas
HERRAJES: correderas, jaladores, cantidad
TORNILLOS: tipo y medida exacta (ej: 7x50mm)
CLAVOS: tipo y cantidad
CANTOS: material y metraje lineal
ADHESIVOS: tipo y cantidad

## 5. 5-7 PASOS ARMADO
Cada paso: nombre | Tiempo | Instrucciones detalladas

## 6. TIEMPO TOTAL: Horas preparacion + ensamble + acabado`,
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
      throw new Error('El análisis tardó demasiado. Intenta con una imagen más clara o espera unos momentos.');
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

    // VALIDACIÓN DE RESOLUCIÓN
    if (!isImageResolutionValid(imageBase64)) {
      return res.status(400).json({
        error: '📷 Imagen muy pequeña',
        message: 'Usa una foto de al menos 480x480 píxeles.',
      });
    }

    // CACHE DE IMÁGENES
    const imageHash = getImageHash(imageBase64);
    if (analysisCache[imageHash]) {
      return res.status(200).json({
        success: true,
        analysis: analysisCache[imageHash].analysis,
        cached: true,
      });
    }

    // ANÁLISIS
    const result = await analyzeWithModel(imageBase64);

    if (!result.analysis || result.analysis.trim().length === 0) {
      return res.status(400).json({
        error: '❌ No se pudo analizar',
        message: 'Intenta con una foto más clara del mueble.',
      });
    }

    // GUARDAR EN CACHÉ
    analysisCache[imageHash] = {
      analysis: result.analysis,
      timestamp: Date.now(),
    };

    // Limpiar caché antiguo
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
    console.error('Error:', error);
    return res.status(500).json({
      error: '⏱️ ' + error.message,
    });
  }
}
