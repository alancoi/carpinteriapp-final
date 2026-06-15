import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function sendWelcomeEmail(email, orderNumber, plan) {
  try {
    console.log('📧 Enviando email de bienvenida a:', email);
    
    const emailBody = {
      sender: { email: 'noreply@carpinteriapp.com', name: 'CarpinteriAPP' },
      to: [{ email: email }],
      subject: '¡Bienvenido a CarpinteriAPP! Tus credenciales de acceso',
      htmlContent: `
        <h2>¡Bienvenido a CarpinteriAPP! 🎉</h2>
        <p>Tu cuenta ha sido creada exitosamente.</p>
        <h3>Tus credenciales de acceso:</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contraseña:</strong> ${orderNumber}</p>
        <h3>Tu Plan: ${plan === 'premium' ? 'Premium Ilimitado' : 'Básico (20 usos/día)'}</h3>
        <p><a href="https://carpinteriapp-final.vercel.app/app" style="background-color: #FF8C00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Inicia Sesión</a></p>
        <p>Si tienes problemas, responde este email.</p>
        <p>¡El futuro de la carpintería! ⚒️</p>
      `,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error Brevo:', error);
      return false;
    }

    console.log('✅ Email enviado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    return false;
  }
}

function verifyShopifyWebhook(rawBody, hmacHeader) {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) {
    console.log('❌ Falta SECRET o HMAC header');
    return false;
  }

  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');

  const isValid = hash === hmacHeader;
  console.log('🔐 Hash calculado:', hash);
  console.log('🔐 HMAC header:', hmacHeader);
  console.log('🔐 ¿Válido?', isValid);
  
  return isValid;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('📦 Webhook Shopify recibido');

    // Obtener el body crudo
    const rawBody = await getRawBody(req);
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];

    console.log('📨 Body recibido:', rawBody.substring(0, 100), '...');
    console.log('🔐 HMAC header recibido:', hmacHeader);

    // Verificar firma
    if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
      console.log('❌ Firma Shopify inválida');
      return res.status(401).json({ error: 'Firma inválida' });
    }

    const order = JSON.parse(rawBody);
    console.log('✅ Firma verificada');
    console.log('📋 Order ID:', order.id);

    // Extraer email del cliente
    const email = order.customer?.email || order.email;
    if (!email) {
      console.log('❌ No hay email en la orden');
      return res.status(400).json({ error: 'No hay email' });
    }

    console.log('📧 Email:', email);

    // La contraseña es el número de orden (como string)
    const orderNumber = order.order_number.toString();
    console.log('🔑 Contraseña (número de orden):', orderNumber);

    // Hashear la contraseña
    const passwordHash = await bcryptjs.hash(orderNumber, 10);
    console.log('🔐 Contraseña hasheada');

    // Determinar el plan según el producto comprado
    let plan = 'basico';
    if (order.line_items && order.line_items.length > 0) {
      const product = order.line_items[0].title.toLowerCase();
      if (product.includes('premium') || product.includes('ilimitado')) {
        plan = 'premium';
      }
    }
    console.log('📊 Plan:', plan);

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      console.log('👤 Usuario ya existe, actualizando...');
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          plan: plan,
          payment_status: 'pagado',
          usos_hoy_restantes: plan === 'premium' ? 1000 : 20,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.toLowerCase());

      if (updateError) {
        console.error('❌ Error actualizando usuario:', updateError);
        return res.status(500).json({ error: 'Error actualizando usuario' });
      }

      console.log('✅ Usuario actualizado');
      
      // Email desactivado por ahora - configurar Brevo después
      // await sendWelcomeEmail(email, orderNumber, plan);
    } else {
      console.log('🆕 Creando nuevo usuario...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          password_hash: passwordHash,
          plan: plan,
          usos_hoy_restantes: plan === 'premium' ? 1000 : 20,
          payment_status: 'pagado',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('❌ Error creando usuario:', insertError);
        return res.status(500).json({ error: 'Error creando usuario' });
      }

      console.log('✅ Usuario creado');
      
      // Email desactivado por ahora - configurar Brevo después
      // await sendWelcomeEmail(email, orderNumber, plan);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook procesado correctamente',
    });
  } catch (error) {
    console.error('❌ ERROR WEBHOOK:', error.message);
    console.error('Stack:', error.stack);

    return res.status(500).json({
      error: 'Error procesando webhook',
      details: error.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware para capturar el body crudo
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', reject);
  });
}
