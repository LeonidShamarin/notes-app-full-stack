const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const dbPath = path.join(__dirname, 'data', 'notes.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err.message);
  } else {
    console.log('Підключено до бази даних SQLite.');
      db.run(`CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`);
  }
});


app.get('/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});


app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  db.run('INSERT INTO notes (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
    [title, content, createdAt, updatedAt],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, title, content, createdAt, updatedAt });
      }
    });
});


app.put('/notes/:id', (req, res) => {
  const { title, content } = req.body;
  const updatedAt = new Date().toISOString();
  const noteId = req.params.id;

  db.run('UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?',
    [title, content, updatedAt, noteId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: noteId, title, content, updatedAt });
      }
    });
});


app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  db.run('DELETE FROM notes WHERE id = ?', noteId, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(204).send();
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server starting on http://localhost:${PORT}`);
});
