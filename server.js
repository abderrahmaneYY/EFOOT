const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); // CRITICAL: Allows the Submit button to work
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get('/matches', async (req, res) => {
    const result = await pool.query('SELECT * FROM matches ORDER BY id ASC');
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