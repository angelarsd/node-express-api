const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola, esta es una API básica en Node.js!');
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
