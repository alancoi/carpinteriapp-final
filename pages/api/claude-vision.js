import crypto from 'crypto';

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
        max_tokens: 5000,
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
SI borroso/oscuro: "⚠️ Imagen borrosa. Mejor iluminacion y resolucion."
SI inclinado: "📐 Foto inclinada. Tomala de frente."

SI BUENA CALIDAD, proporciona EXACTAMENTE en este orden:

## 1. DIMENSIONES (cm)
Tabla simple: Ancho | Alto | Profundidad | Espesor | Detalles

## 2. PLANO ASCII (compacto y claro)
Diagrama frontal SIMPLE en 10-15 lineas max con medidas principales

## 3. CORTES PLACA 275x183cm
Tabla: Pieza | Cantidad | Largo | Ancho | cm2
Calculo: Area total | Area usada | Desperdicio (cm2 y %)

## 4. MATERIALES EXACTOS
- Tableros: tipo, cantidad, medidas
- Herrajes: tipo, cantidad (correderas, jaladores, etc)
- Tornillos: tipo exacto con medida (ej: 7x50mm), cantidad
- Clavos: tipo, cantidad
- Cantos: material, cantidad ml
- Adhesivos: tipo, cantidad

## 5. HERRAMIENTAS NECESARIAS
Lista simple: sierra, taladro, destornillador, nivel, metro, lija, etc

## 6. PASOS DE ARMADO (5-7 pasos)
Formato: PASO N - Nombre | Tiempo | Instrucciones claras

## 7. ACABADO FINAL
Recomendacion: Pintura/barniz/sellador, aplicacion, secado

## 8. NIVEL DIFICULTAD
Facil / Medio / Dificil + Justificacion (ej: "Medio: requiere taladro y medidas exactas")

## 9. NOTAS IMPORTANTES
3-5 puntos: cuidados, esperas, verificaciones criticas

## 10. ALTERNATIVAS DE MATERIALES
2-3 opciones: "Se puede reemplazar X por Y si..."

## 11. TIEMPO TOTAL
Suma: preparacion + armado + acabado = HORAS TOTALES

Responde COMPLETO, NO abrevies. Se conciso pero detallado.`,
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido' });
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

    const result = await analyzeWithModel(imageBase64);

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
    console.error('Error:', error);
    return res.status(500).json({
      error: '⏱️ ' + error.message,
    });
  }
}
