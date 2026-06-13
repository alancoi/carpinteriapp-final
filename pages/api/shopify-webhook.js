import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  console.log('📡 Webhook recibido:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    let orderData = req.body;
    if (typeof orderData === 'string') {
      orderData = JSON.parse(orderData);
    }

    console.log('📦 Datos orden:', { email: orderData.email, name: orderData.name });

    const email = orderData.email;
    const orderId = orderData.name?.replace('#', '') || 'unknown';
    
    if (!email) {
      console.log('❌ Sin email');
      return res.status(400).json({ error: 'Sin email' });
    }

    let plan = 'basico';
    if (orderData.line_items?.[0]?.title?.toLowerCase().includes('premium')) {
      plan = 'premium';
    }

    const tempPassword = orderId.slice(-6) || '123456';
    console.log('✅ Datos preparados:', { email, plan, password: tempPassword });

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

    console.log('✅ Usuario guardado:', email);
    console.log('📧 EMAIL DESACTIVADO TEMPORALMENTE - Solo se crea el usuario');

    return res.status(200).json({ 
      success: true,
      email: email,
      plan: plan,
      password: tempPassword,
      message: 'Usuario creado correctamente'
    });
  } catch (error) {
    console.error('❌ ERROR WEBHOOK:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
