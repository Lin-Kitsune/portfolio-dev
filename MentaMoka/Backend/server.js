const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const webpayRoutes = require("./routes/webpay.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // 👈 ESTA LÍNEA ES CLAVE

// Ruta base para WebPay
app.use("/webpay", webpayRoutes);

// Ruta raíz para testear si está corriendo
app.get("/", (req, res) => {
  res.send("✅ WebPay API corriendo correctamente.");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
