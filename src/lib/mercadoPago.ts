
import { initMercadoPago } from '@mercadopago/sdk-react';

// Configuração da API do Mercado Pago
export const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "TEST-123456789";

export const initializeMercadoPago = (publicKey: string = MERCADO_PAGO_PUBLIC_KEY) => {
  try {
    initMercadoPago(publicKey);
    console.log('MercadoPago inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar MercadoPago:', error);
    return false;
  }
};

export const createPreference = async (title: string, price: number, email: string) => {
  try {
    // Chamando a função serverless para criar a preferência de pagamento
    const response = await fetch('/.netlify/functions/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        price,
        email,
        // Informações adicionais que podem ser úteis
        payer: {
          email
        },
        metadata: {
          product_id: "site-personalizado",
          customer_email: email
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar preferência de pagamento');
    }
    
    const data = await response.json();
    return data.preferenceId;
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    throw error;
  }
};

// Função para consultar o status do pagamento
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await fetch(`/.netlify/functions/check-payment?id=${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao verificar status do pagamento');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw error;
  }
};

// Função para salvar os dados do site após pagamento confirmado
export const saveSiteData = async (siteData: any, paymentId: string) => {
  try {
    const response = await fetch('/.netlify/functions/save-site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        siteData,
        paymentId
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao salvar dados do site');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar dados do site:', error);
    throw error;
  }
};
