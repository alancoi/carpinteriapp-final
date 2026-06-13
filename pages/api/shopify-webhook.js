import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  console.log('📡 Webhook Shopify:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    let orderData = req.body;
    if (typeof orderData === 'string') {
      orderData = JSON.parse(orderData);
    }

    console.log('📦 Pedido recibido:', orderData.name);

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

    console.log('✅ Creando usuario:', { email, plan, password: orderNumber });

    await connectDB();
    const db = mongoose.connection.db;
    
    const result = await db.collection('users').updateOne(
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

    console.log('✅ Usuario creado/actualizado en MongoDB');
    console.log('📧 Shopify enviará automáticamente el email de confirmación');

    return res.status(200).json({ 
      success: true,
      message: 'Usuario creado correctamente en MongoDB',
      email,
      plan,
      password: orderNumber
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
