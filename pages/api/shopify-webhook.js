import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    let orderData = req.body;
    if (typeof orderData === 'string') {
      orderData = JSON.parse(orderData);
    }

    const email = orderData.email;
    const orderId = orderData.name?.replace('#', '') || 'unknown';
    
    if (!email) {
      console.log('⚠️ Sin email en la orden');
      return res.status(400).json({ error: 'Sin email' });
    }

    // Determinar plan
    let plan = 'basico';
    if (orderData.line_items?.[0]?.title?.toLowerCase().includes('premium')) {
      plan = 'premium';
    }

    const tempPassword = orderId.slice(-6) || '123456';

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

    console.log('✅ Usuario creado:', email, 'Plan:', plan);

    // Enviar email
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #0D47A1 0%, #0A1B3F 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
    .header { background: linear-gradient(135deg, #FF8C00 0%, #0D47A1 100%); padding: 40px 20px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; }
    .logo { height: 60px; margin-bottom: 15px; }
    .content { padding: 40px; }
    .greeting { font-size: 20px; color: #0A1B3F; margin-bottom: 20px; font-weight: bold; }
    .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF8C00; }
    .info-label { color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; }
    .info-value { color: #0D47A1; font-size: 18px; font-weight: bold; font-family: 'Courier New', monospace; }
    .plan-badge { display: inline-block; padding: 8px 16px; background: ${plan === 'premium' ? '#FFE082' : '#90CAF9'}; color: ${plan === 'premium' ? '#F57F17' : '#0D47A1'}; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .button { display: inline-block; background: #FF8C00; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; font-size: 16px; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.postimg.cc/XpQvP00b/image.png" alt="CarpinteríApp" class="logo">
      <h1>¡Bienvenido a CarpinteríApp!</h1>
      <p>Tu herramienta profesional para carpintería</p>
    </div>
    
    <div class="content">
      <div class="greeting">¡Gracias por tu compra! 🎉</div>
      
      <p>Hemos activado tu cuenta. Tu acceso incluye:</p>
      
      <div class="plan-badge">${plan === 'premium' ? '⭐ Plan Premium - Ilimitado' : '📱 Plan Básico - 20 usos/día'}</div>
      
      <p>Tus credenciales:</p>
      
      <div class="info-box">
        <div class="info-label">📧 Email</div>
        <div class="info-value">${email}</div>
      </div>
      
      <div class="info-box">
        <div class="info-label">🔐 Contraseña</div>
        <div class="info-value">${tempPassword}</div>
      </div>
      
      <p style="text-align: center;">
        <a href="https://carpinteriapp-final.vercel.app/app" class="button">➜ Ingresar a CarpinteríApp</a>
      </p>
      
      <p style="color: #6b7280; font-size: 13px;">💡 Puedes cambiar tu contraseña en la app en cualquier momento.</p>
    </div>
    
    <div class="footer">
      <p>CarpinteríApp - El futuro de la carpintería</p>
      <p>© 2026 Mundo Oficio</p>
    </div>
  </div>
</body>
</html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: '¡Bienvenido a CarpinteríApp! Tu acceso está listo',
        html: htmlContent,
      });

      console.log('✅ Email enviado a:', email);
    } catch (emailError) {
      console.error('⚠️ Error email:', emailError.message);
      // No fallar si el email no se envía
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error webhook:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
