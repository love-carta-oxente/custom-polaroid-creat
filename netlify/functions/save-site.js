
const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  // Certifique-se de que a solicitação é POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  let client;
  try {
    // Obter dados do corpo da solicitação
    const { siteData, paymentId } = JSON.parse(event.body);
    
    if (!siteData || !siteData.siteId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados do site ou ID do site não fornecidos' }),
      };
    }

    // Configuração do MongoDB
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'URI do MongoDB não configurada' }),
      };
    }

    // Conectar ao MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('propostasPersonalizadas');
    const sitesCollection = database.collection('sites');
    
    // Salvar dados do site
    const result = await sitesCollection.insertOne({
      ...siteData,
      paymentId,
      createdAt: new Date(),
    });
    
    // Retornar resultado
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        siteId: siteData.siteId,
        message: 'Site salvo com sucesso',
      }),
    };
  } catch (error) {
    console.error('Erro ao salvar dados do site:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erro ao salvar dados do site', 
        details: error.message 
      }),
    };
  } finally {
    // Fechar conexão com o MongoDB
    if (client) {
      await client.close();
    }
  }
};
