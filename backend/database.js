const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data folder');
}

const dbPath = path.join(dataDir, 'notes.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database:', dbPath);
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating notes table:', err.message);
    } else {
      console.log('Notes table is ready to use');
    }
  });
});

const notesDB = {
   getAllNotes: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM notes ORDER BY updatedAt DESC', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

   getNoteById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  createNote: (title, content) => {
    return new Promise((resolve, reject) => {
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      db.run(
        'INSERT INTO notes (title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
        [title, content, createdAt, updatedAt],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              title,
              content,
              createdAt,
              updatedAt
            });
          }
        }
      );
    });
  },

  updateNote: (id, title, content) => {
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString();

      db.run(
        'UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?',
        [title, content, updatedAt, id],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            reject(new Error('Note not found'));
          } else {
            resolve({
              id: parseInt(id),
              title,
              content,
              updatedAt
            });
          }
        }
      );
    });
  },

  deleteNote: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM notes WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Note not found'));
        } else {
          resolve({ deletedId: id });
        }
      });
    });
  }
};

module.exports = notesDB;
