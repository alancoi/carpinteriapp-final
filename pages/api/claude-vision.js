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
                text: `Verifica si esta imagen es un mueble de BUENA CALIDAD.

SI NO mueble: "❌ No es mueble. Sube foto clara."
SI borroso/oscuro: "⚠️ Imagen borrosa. Mejor iluminación y resolución."
SI inclinado: "📐 Foto inclinada. Tómala de frente."

SI BUENA CALIDAD, DEVUELVE HTML CON ESTE FORMATO EXACTO (TODO EN ESPAÑOL):

<div style="font-family: Arial, sans-serif; color: #333;">

<h2 style="color: #1565C0; border-bottom: 3px solid #FF8C00; padding-bottom: 10px;">1. COMPONENTES Y MEDIDAS</h2>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 15px 0;">
  <div style="border: 2px solid #1565C0; border-radius: 8px; padding: 12px; background: #F5F5F5;">
    <strong style="color: #FF8C00;">Tablero superior</strong><br>
    Cantidad: 1 | Largo: 183cm | Ancho: 64cm<br>
    Espesor: 1.8cm | Material: Madera sólida
  </div>
  <div style="border: 2px solid #1565C0; border-radius: 8px; padding: 12px; background: #F5F5F5;">
    <strong style="color: #FF8C00;">Pata</strong><br>
    Cantidad: 4 | Largo: 5cm | Ancho: 5cm<br>
    Espesor: 81cm | Material: Madera sólida
  </div>
  [Continúa con TODOS los componentes en recuadros 2x2]
</div>

<h2 style="color: #1565C0; border-bottom: 3px solid #FF8C00; padding-bottom: 10px; margin-top: 20px;">2. LISTA DE COMPRA</h2>

<div style="border: 2px solid #1565C0; border-radius: 8px; padding: 15px; background: #F5F5F5; margin: 15px 0;">
  <p><strong>Madera:</strong> [tipo], [cantidad m²], medidas [principales]</p>
  <p><strong>Herrajes:</strong> [tipo exacto], [cantidad unidades]</p>
  <p><strong>Tornillos:</strong> [diámetro × largo mm], [cantidad unidades]</p>
  <p><strong>Clavos:</strong> [medida exacta mm], [cantidad unidades]</p>
  <p><strong>Cantos:</strong> [material], [cantidad metros lineales]</p>
  <p><strong>Adhesivos:</strong> [tipo], [cantidad]</p>
</div>

<h2 style="color: #1565C0; border-bottom: 3px solid #FF8C00; padding-bottom: 10px; margin-top: 20px;">3. CORTES DE PLACA 275×183cm</h2>

<div style="border: 2px solid #1565C0; border-radius: 8px; padding: 15px; background: #F5F5F5; margin: 15px 0;">
  <p><strong>Pieza:</strong> [nombre] | <strong>Cantidad:</strong> [n] | <strong>Medidas:</strong> [L]×[A]cm | <strong>Área:</strong> [área]cm²</p>
  [Continúa con TODAS las piezas]
  <hr style="border: none; border-top: 1px solid #CCC; margin: 15px 0;">
  <p><strong>Área total placa:</strong> 50.325cm² | <strong>Área usada:</strong> [XX]cm² | <strong>Desperdicio:</strong> [XX]% / [XX]cm²</p>
</div>

<h2 style="color: #1565C0; border-bottom: 3px solid #FF8C00; padding-bottom: 10px; margin-top: 20px;">4. NOTAS CRÍTICAS</h2>

<div style="border-left: 4px solid #FF8C00; border-radius: 4px; padding: 15px; background: #FFF3E0; margin: 15px 0;">
  <p>⚠️ [dato crítico técnico]</p>
  <p>⚠️ [dato crítico técnico]</p>
  <p>⚠️ [dato crítico técnico]</p>
</div>

<p style="color: #666; font-size: 0.9em; margin-top: 20px; border-top: 1px solid #CCC; padding-top: 15px;">
  <strong>⚠️ NOTA FINAL:</strong> Las medidas son APROXIMADAS en centímetros basadas en la imagen enviada.
</p>

</div>`,
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
