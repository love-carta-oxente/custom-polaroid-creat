
const axios = require('axios');

exports.handler = async function(event, context) {
  // Certifique-se de que a solicitação é GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    // Obter ID do pagamento da consulta
    const paymentId = event.queryStringParameters.id;
    
    if (!paymentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'ID de pagamento não fornecido' }),
      };
    }

    // Configuração do Mercado Pago
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Token de acesso do Mercado Pago não configurado' }),
      };
    }

    // Verificar status do pagamento
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Retornar informações do pagamento
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: response.data.status,
        statusDetail: response.data.status_detail,
        payerId: response.data.payer.id,
        paymentMethod: response.data.payment_method_id,
        paymentTypeId: response.data.payment_type_id,
        isApproved: response.data.status === 'approved',
      }),
    };
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erro ao verificar status do pagamento', 
        details: error.message 
      }),
    };
  }
};
