const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// INITIAL SETUP: This includes your OLD DATA
const oldData = [
  { k: 6, a: 5, date: '2026-04-03' },
  { k: 4, a: 6, date: '2026-04-03' },
  // ... Add all 27 matches from your file here
  { k: 2, a: 4, date: '2026-04-13' }
];

app.get('/matches', async (req, res) => {
  const result = await pool.query('SELECT * FROM matches ORDER BY date DESC');
  res.json(result.rows);
});

app.post('/matches', async (req, res) => {
  const { k, a, date } = req.body;
  const result = await pool.query(
    'INSERT INTO matches (k, a, date) VALUES ($1, $2, $3) RETURNING *',
    [k, a, date]
  );
  res.json(result.rows[0]);
});

app.listen(process.env.PORT || 3000);