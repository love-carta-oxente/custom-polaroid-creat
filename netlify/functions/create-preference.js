
const axios = require('axios');

exports.handler = async function(event, context) {
  // Certifique-se de que a solicitação é POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    // Obter dados do corpo da solicitação
    const { title, price, email, payer, metadata } = JSON.parse(event.body);

    // Configuração do Mercado Pago
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Token de acesso do Mercado Pago não configurado' }),
      };
    }

    // Criar preferência de pagamento
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      {
        items: [
          {
            title: title,
            quantity: 1,
            unit_price: price,
            currency_id: 'BRL',
          },
        ],
        payer: {
          email: email,
        },
        back_urls: {
          success: `${process.env.URL || 'http://localhost:5173'}/payment-success`,
          failure: `${process.env.URL || 'http://localhost:5173'}/payment-failure`,
          pending: `${process.env.URL || 'http://localhost:5173'}/payment-pending`,
        },
        auto_return: 'approved',
        statement_descriptor: 'Proposta Personalizada',
        metadata: metadata || {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Retornar ID da preferência
    return {
      statusCode: 200,
      body: JSON.stringify({
        preferenceId: response.data.id,
      }),
    };
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erro ao criar preferência de pagamento', 
        details: error.message 
      }),
    };
  }
};
