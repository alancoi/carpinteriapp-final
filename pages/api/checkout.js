import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { nombre, apellido, email, telefono } = req.body;

    // Validar datos
    if (!nombre || !apellido || !email || !telefono) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    console.log('📦 Checkout iniciado:', { nombre, apellido, email, telefono });

    // 1️⃣ CREAR ORDEN EN SHOPIFY
    const shopifyOrder = {
      order: {
        email: email,
        customer: {
          first_name: nombre,
          last_name: apellido,
          email: email,
          phone: telefono,
          addresses: [
            {
              first_name: nombre,
              last_name: apellido,
              address1: 'Genérico',
              city: 'Buenos Aires',
              province: 'Buenos Aires',
              country: 'Argentina',
              zip: '1000',
              phone: telefono,
              default: true
            }
          ]
        },
        line_items: [
          {
            title: 'CarpinteriApp: El futuro de la carpintería',
            price: '25.990',
            quantity: 1,
            sku: 'CARPINTERIAPP-001'
          }
        ],
        financial_status: 'pending',
        fulfillment_status: 'unshipped'
      }
    };

    const shopifyApi = `${process.env.NEXT_PUBLIC_SHOPIFY_API_URL || 'https://carpinteriapp.myshopify.com/admin/api/2024-01'}/orders.json`;
    
    console.log('🛒 Creando orden en Shopify...');
    const shopifyResponse = await axios.post(shopifyApi, shopifyOrder, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const orderId = shopifyResponse.data.order.id;
    const orderNumber = shopifyResponse.data.order.order_number;

    console.log('✅ Orden Shopify creada:', orderNumber);

    // 2️⃣ CREAR PREFERENCIA EN MERCADO PAGO
    const mercadoPagoPreference = {
      items: [
        {
          title: 'CarpinteriApp: El futuro de la carpintería',
          quantity: 1,
          unit_price: 25990,
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: nombre,
        surname: apellido,
        email: email,
        phone: {
          number: telefono
        }
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL || 'https://carpinteriapp.site'}/success?order=${orderNumber}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL || 'https://carpinteriapp.site'}/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL || 'https://carpinteriapp.site'}/pending`
      },
      auto_return: 'approved',
      external_reference: `order-${orderNumber}`,
      metadata: {
        orderId: orderId,
        orderNumber: orderNumber
      }
    };

    console.log('💳 Creando preferencia Mercado Pago...');
    const mercadoPagoResponse = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      mercadoPagoPreference,
      {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const preferenceId = mercadoPagoResponse.data.id;
    const paymentUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

    console.log('✅ Preferencia Mercado Pago creada:', preferenceId);

    // 3️⃣ RESPONDER CON URL DE PAGO
    return res.status(200).json({
      success: true,
      orderNumber: orderNumber,
      paymentUrl: paymentUrl,
      redirectTo: paymentUrl
    });

  } catch (error) {
    console.error('❌ Error en checkout:', error.response?.data || error.message);
    
    return res.status(500).json({
      error: 'Error al procesar el pago',
      details: error.response?.data?.message || error.message
    });
  }
}
