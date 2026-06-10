export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, previousMessages } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key no configurada' });
    }

    // Convertir historial a formato de Claude
    const messages = [
      ...previousMessages.map(msg => ({
        role: msg.role,
        content: msg.text,
      })),
      {
        role: 'user',
        content: message,
      }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `Eres un asesor experto en carpintería y diseño de muebles. Ayudas a carpinteros con:
- Consultas sobre técnicas de carpintería
- Diseño y planeación de muebles
- Materiales y herramientas
- Presupuestos y costos
- Consejos profesionales

Responde de forma clara, concisa y práctica. Usa español. Si la pregunta no es sobre carpintería, amablemente redirige a temas de carpintería.`,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error en API');
    }

    const assistantMessage = data.content && data.content[0] && data.content[0].type === 'text'
      ? data.content[0].text
      : 'No pude procesar tu pregunta. Intenta de nuevo.';

    return res.status(200).json({
      success: true,
      response: assistantMessage,
    });
  } catch (error) {
    console.error('Error en chat API:', error);
    return res.status(500).json({
      error: 'Error procesando mensaje',
      details: error.message,
    });
  }
}
