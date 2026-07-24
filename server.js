// server.js (Express version)
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function validateName(name) {
  if (!name) return { ok: false, error: 'student_name is required' };
  const s = String(name).trim();
  if (s.length === 0) return { ok: false, error: 'student_name is required' };
  if (s.length > 100) return { ok: false, error: 'student_name must be 100 characters or less' };
  return { ok: true, value: s };
}

// API routes (prefixed with /api)
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY student_id LIMIT 100');
    res.json({ rows: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  const { student_name } = req.body;
  const v = validateName(student_name);
  if (!v.ok) return res.status(400).json({ error: v.error });
  const name = escapeHtml(v.value);
  try {
    const result = await pool.query('INSERT INTO students (student_name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json({ row: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const id = req.params.id;
  const { student_name } = req.body;
  const v = validateName(student_name);
  if (!v.ok) return res.status(400).json({ error: v.error });
  const name = escapeHtml(v.value);
  try {
    const result = await pool.query('UPDATE students SET student_name = $1 WHERE student_id = $2 RETURNING *', [name, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'student not found' });
    res.json({ row: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM students WHERE student_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'student not found' });
    res.json({ row: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback to index.html for SPA-style
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
