const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_URL = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0";
const RETURN_URL = process.env.RETURN_URL;
const COMMERCE_CODE = process.env.COMMERCE_CODE;
const API_KEY = process.env.API_KEY;

// Crear transacción
router.post("/create", async (req, res) => {
  const { amount, buyOrder, sessionId } = req.body;

  try {
    const response = await axios.post(`${API_URL}/transactions`, {
      buy_order: buyOrder,
      session_id: sessionId,
      amount,
      return_url: `${RETURN_URL}?session_id=${sessionId}`,
    }, {
      headers: {
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error creando transacción:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

// Confirmar transacción
router.post("/commit", async (req, res) => {
  const { token } = req.body;

  try {
    const response = await axios.put(`${API_URL}/transactions/${token}`, {}, {
      headers: {
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error confirmando transacción:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al confirmar transacción" });
  }
});

// 🔁 Ruta que recibe el token desde Transbank y redirige al frontend con los datos
router.post("/return", async (req, res) => {
  const token = req.body.token_ws;

  if (!token) {
    return res.redirect("http://localhost:4200/pago-exitoso?error=NoToken");
  }

  try {
    const response = await axios.put(`${API_URL}/transactions/${token}`, {}, {
      headers: {
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
        "Content-Type": "application/json"
      }
    });
  
    const data = response.data;
  
    // 👇 AGREGA ESTO
    console.log("🧾 Datos recibidos desde WebPay:", data);
  
    const redirectUrl = new URL("http://localhost:4200/pago-exitoso");
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("status", data.status);
    redirectUrl.searchParams.set("amount", data.amount);
    redirectUrl.searchParams.set("buy_order", data.buy_order);
    redirectUrl.searchParams.set("authorization_code", data.authorization_code);
    redirectUrl.searchParams.set("transaction_date", data.transaction_date);
    redirectUrl.searchParams.set("installments", data.installments_number || '');
    redirectUrl.searchParams.set("card_number", data.card_detail?.card_number || '');
  
    res.redirect(redirectUrl.toString());
  }
   catch (error) {
    console.error("❌ Error en /return:", error.response?.data || error.message);
    res.redirect("http://localhost:4200/pago-exitoso?error=ConfirmFailed");
  }
});

module.exports = router;
