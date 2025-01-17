import express, { json } from 'express';
import dotenv from 'dotenv';
import postgresql from 'pg';
import cors from 'cors';
import { faker } from '@faker-js/faker';

const { Client } = postgresql;
dotenv.config();
faker.locale = 'es';

const PORT = process.env.PORT || 3000;

const CONFIG_DB = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }, // SSL connection settings
};

// const server = http.createServer((req, res) => {

//   res.setHeader('Content-Type', 'application/json');

//   if (req.method === 'GET' && req.url === '/') {
//     res.writeHead(200);
//     res.end(JSON.stringify({ 
//        message: 'Welcome to the basic API without Express!' 
//     }));
//   } else {
//     res.writeHead(404);
//     res.end(JSON.stringify({ message: 'Route not found' }));
//   }
// });

const app = express();

app.use(json());
app.use(cors());

const db = new Client(CONFIG_DB);

app.use(async (req, res, next) => {
  try {
    if (!db._connected) {
      await db.connect();
      db._connected = true;
    }
    next();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    res.status(500).send('Error connecting to the database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, this is a basic API in Node.js!');
});

app.get('/data', async (req, res) => {
  try {
    const result = await db.query('SELECT * from test');
    res.json({ result: result.rows });
  } catch (err) {
    console.error('Error executing the query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * from test WHERE id =${id}`);

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing the query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/data', async (req, res) => {
  try {
    const { name, lastname, age, gender, email } = req.body;
    const query = 
      `INSERT INTO public.test (id, "name", lastname, age, gender, email) 
        VALUES(
          nextval('test_id_seq'::regclass),
          '${name}', '${lastname}', '${age}', '${gender}', '${email}'
        ) RETURNING *`;
    const result = await db.query(query);

    res
      .status(201)
      .json({ message: 'Data inserted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error executing the query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, age, gender, email } = req.body;
    const result =  await db.query(
      `UPDATE test SET 
        "name"='${name}', 
        lastname='${lastname}', 
        gender='${gender}', 
        age='${age}', 
        email='${email}' 
      WHERE id =${id} RETURNING *`
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Data updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error executing the query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`DELETE from test WHERE id =${id} RETURNING *`);

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json({ message: 'Data deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error executing the query:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('#/fake', async (req, res) => {
  try {
    const totalRecords = 100; // Número de registros a generar

    for (let i = 0; i < totalRecords; i++) {
      const name = faker.person.firstName();
      const lastname = faker.person.lastName();
      const age = faker.number.int({ min: 18, max: 70 });

      // Mapeo para convertir 'male' o 'female' a 'M' o 'F'
      const genderMap = {
        male: 'M',
        female: 'F'
      };
      const gender = genderMap[faker.person.sex()];
      const email = faker.internet.email(name, lastname);

      // Inserta los datos en la base de datos
      await db.query(
        'INSERT INTO test (name, lastname, age, gender, email) VALUES ($1, $2, $3, $4, $5)',
        [name, lastname, age, gender, email]
      );

      console.log(`Registro ${i + 1} insertado:`, { name, lastname, age, gender, email });
    }

    console.log(`${totalRecords} registros insertados correctamente.`);
  } catch (err) {
    console.error("Error insertando datos de prueba:", err);
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Closing the connection...');
  if (db._connected) {
    await db.end();
  }
  process.exit();
});
