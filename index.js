const express = require('express');
require("dotenv").config();
const { Client } = require("pg");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

const CONFIG_DB = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true, // Configuración para conexiones SSL
  },
};

const db = new Client(CONFIG_DB);

app.use(async (req, res, next) => {
  try {
    if (!db._connected) {
      await db.connect();
      db._connected = true;
    }
    next();
  } catch (err) {
    console.error("Error conectando a la base de datos:", err);
    res.status(500).send("Error conectando a la base de datos");
  }
});

app.get('/', async (req, res) => {
  try {
    const result = await db.query("SELECT * from test");
    res.send(`Resultados de la consulta: ${JSON.stringify(result.rows)}`);
  } catch (err) {
    console.error("Error ejecutando la consulta:", err);

  }
});

app.get('/data', (req, res) => {
  res.json({ message: 'Esta es la ruta /data', data: [1, 2, 3] });
});

app.post('/data', (req, res) => {
  const newData = req.body;
  res.status(201).json({ message: 'Datos recibidos', data: newData });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Cerrando la conexión...");
  if (db._connected) {
    await db.end();
  }
  process.exit();
});
