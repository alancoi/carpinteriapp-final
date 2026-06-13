import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

async function sendWelcomeEmail(email, orderNumber) {
  try {
    console.log('📧 Enviando email a:', email);

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #FF8C00 0%, #0D47A1 100%); padding: 40px 20px; text-align: center; color: white; }
    .logo { height: 80px; margin-bottom: 20px; }
    .title { font-size: 28px; font-weight: 600; margin: 0; }
    .subtitle { font-size: 15px; opacity: 0.95; margin-top: 8px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 20px; color: #0A1B3F; margin-bottom: 20px; font-weight: 600; }
    .text { font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px; }
    .label { font-size: 12px; text-transform: uppercase; color: #999; font-weight: 600; margin-bottom: 8px; }
    .box { background: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #FF8C00; }
    .value { font-size: 18px; color: #0D47A1; font-weight: 600; font-family: monospace; }
    .buttons { display: flex; flex-direction: column; gap: 12px; margin: 30px 0; }
    .btn { display: inline-block; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; text-align: center; }
    .btn-primary { background: #FF8C00; color: white; }
    .btn-secondary { background: white; color: #0D47A1; border: 2px solid #0D47A1; }
    .info { background: #f0f4ff; border-left: 4px solid #0D47A1; padding: 16px; margin: 20px 0; }
    .info p { font-size: 14px; color: #0D47A1; margin: 0 0 8px 0; }
    .bonus { background: #fff3e0; border-left: 4px solid #FF8C00; padding: 16px; margin: 20px 0; }
    .bonus p { font-size: 15px; color: #E67E00; margin: 0; font-weight: 600; }
    .note { font-size: 13px; color: #999; margin-top: 20px; }
    .footer { background: #f5f5f5; padding: 24px 30px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.postimg.cc/XpQvP00b/image.png" alt="CarpinteríApp" class="logo">
      <h1 class="title">¡Bienvenido a CarpinteríApp!</h1>
      <p class="subtitle">El futuro de la carpintería</p>
    </div>
    
    <div class="content">
      <p class="greeting">¡Gracias por tu compra! 🎉</p>
      <p class="text">Hemos activado tu cuenta correctamente.</p>
      
      <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Tus credenciales de acceso:</p>
      
      <div class="label">📧 Email</div>
      <div class="box">
        <div class="value">${email}</div>
      </div>
      
      <div class="label">🔐 Contraseña</div>
      <div class="box">
        <div class="value">${orderNumber}</div>
      </div>
      
      <div class="buttons">
        <a href="https://carpinteriapp-final.vercel.app/app" class="btn btn-primary">➜ Ingresar a la app</a>
        <a href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=78546f55ec2d4478a7f6cc2da56ab918" class="btn btn-secondary">💳 Activar suscripción mensual</a>
      </div>
      
      <div class="info">
        <p><strong>Suscripción mensual:</strong> Activa tu suscripción en Mercado Pago para acceder ilimitadamente a CarpinteríApp. Se te cobrará $25.990 cada mes de forma automática.</p>
        <p style="font-size: 13px; margin-top: 12px;">✓ Podés cancelar cuando quieras, sin costo extra.</p>
      </div>
      
      <div class="bonus">
        <p>🎁 ¡Vas a recibir todas las semanas planos de diferentes muebles de regalo por mail!</p>
      </div>
      
      <p class="note">💡 <strong>Nota:</strong> Puedes cambiar tu contraseña en la app en cualquier momento.</p>
      <p class="note">Si tienes dudas, contactanos a <strong>soporte@carpinteriapp.site</strong></p>
    </div>
    
    <div class="footer">
      <p>CarpinteríApp - El futuro de la carpintería</p>
      <p>© 2026 Mundo Oficio</p>
    </div>
  </div>
</body>
</html>`;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'CarpinteríApp', email: 'contact@example.com' },
        to: [{ email: email }],
        subject: '¡Bienvenido a CarpinteríApp! Tu acceso está listo',
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Brevo error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log('✅ Email enviado:', result);
  } catch (error) {
    console.error('❌ Error email:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  console.log('📡 Webhook:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    let orderData = req.body;
    if (typeof orderData === 'string') {
      orderData = JSON.parse(orderData);
    }

    console.log('📦 ORDEN COMPLETA:', JSON.stringify(orderData, null, 2));
    console.log('📧 Email field:', orderData.email);
    console.log('📧 Customer email:', orderData.customer?.email);
    console.log('📧 Contact email:', orderData.contact_email);

    const email = orderData.email || orderData.customer?.email || orderData.contact_email;
    const orderNumber = orderData.name?.replace('#', '') || 'unknown';
    
    if (!email) {
      console.log('❌ Sin email');
      return res.status(400).json({ error: 'Sin email' });
    }

    let plan = 'basico';
    if (orderData.line_items?.[0]?.title?.toLowerCase().includes('premium')) {
      plan = 'premium';
    }

    console.log('✅ Usuario:', email, 'Plan:', plan);

    await connectDB();
    const db = mongoose.connection.db;
    
    await db.collection('users').updateOne(
      { email },
      { $set: {
        email,
        plan,
        usosHoyRestantes: 20,
        ultimoResetUsos: new Date(),
        paymentStatus: 'pagado',
        createdAt: new Date(),
        updatedAt: new Date(),
      }},
      { upsert: true }
    );

    try {
      await sendWelcomeEmail(email, orderNumber);
    } catch (emailError) {
      console.error('⚠️ Error enviando email:', emailError.message);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
