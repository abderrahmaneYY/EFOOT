const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET all matches from Postgres
app.get('/matches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM matches ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new match to Postgres
app.post('/matches', async (req, res) => {
  const { k, a, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO matches (k, a, date) VALUES ($1, $2, $3) RETURNING *',
      [k, a, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a match
app.delete('/matches/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM matches WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));