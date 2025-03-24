const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { WebpayPlus } = require('transbank-sdk');  // Importación correcta del SDK
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Credenciales de WebPay (estas son las de prueba)
const TbkApiKeyId = '597055555532'; // Código de comercio Webpay Plus
const TbkApiKeySecret = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'; // Llave secreta (Api Key Secret)

// Endpoint para crear la transacción en WebPay
app.post('/createWebPayTransaction', async (req, res) => {
  const { buy_order, session_id, amount, return_url } = req.body;

  // Validar que los parámetros necesarios están presentes
  if (!buy_order || !session_id || !amount || !return_url) {
    return res.status(400).json({ message: 'Faltan parámetros en la solicitud' });
  }

  // Crear la transacción con WebPay
  const transaction = new WebpayPlus.Transaction();
  try {
    const response = await transaction.create(buy_order, session_id, amount, return_url);

    // Verifica la respuesta y maneja errores posibles
    if (response && response.token && response.url) {
      console.log('Respuesta de WebPay:', response);
      return res.json(response); // Regresa el token y la URL al frontend
    } else {
      console.error('Respuesta inesperada de WebPay:', response);
      return res.status(500).json({ message: 'Respuesta inesperada de WebPay', error: response });
    }
  } catch (error) {
    console.error('Error al crear la transacción con WebPay', error.response ? error.response.data : error);
    return res.status(500).json({ 
      message: 'Error al procesar la transacción', 
      error: error.response ? error.response.data : error.message 
    });
  }
});

// Endpoint para confirmar la transacción después del pago
app.post('/confirmWebPayTransaction', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token de transacción no proporcionado' });
  }

  try {
    const response = await axios.put(
      `https://webpay3g.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
      {},
      {
        headers: {
          'Tbk-Api-Key-Id': TbkApiKeyId,
          'Tbk-Api-Key-Secret': TbkApiKeySecret,
          'Content-Type': 'application/json',
        },
      }
    );

    // Devolver el estado de la transacción
    res.json(response.data);
  } catch (error) {
    console.error('Error al confirmar la transacción con WebPay', error.response ? error.response.data : error);
    res.status(500).json({ message: 'Error al confirmar la transacción', error: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
