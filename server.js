const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
// const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
/* app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
})); */
app.use(express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB
const dataDir = path.join(__dirname, 'data');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'db.sqlite');
const db = new Database(dbPath);

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  index_number TEXT UNIQUE,
  full_name TEXT,
  reg_no TEXT,
  department TEXT,
  amount_paid REAL DEFAULT 0,
  amount_owed REAL DEFAULT 0,
  status TEXT DEFAULT 'Unpaid'
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  target INTEGER DEFAULT 0,
  deadline TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT DEFAULT CURRENT_TIMESTAMP,
  student_id INTEGER,
  event_id INTEGER,
  method TEXT,
  amount REAL,
  status TEXT,
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  filename TEXT,
  mimetype TEXT,
  size INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT,
  comment TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Helpers
function runQuery(sql, params=[]) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}
function allQuery(sql, params=[]) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}
function getQuery(sql, params=[]) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

// Students API
app.get('/api/students', (req, res) => res.json(allQuery('SELECT * FROM students ORDER BY id DESC')));
app.post('/api/students', (req,res)=>{
  const { index_number, full_name, reg_no, department, amount_paid, amount_owed, status } = req.body;
  try {
    const info = runQuery(`INSERT INTO students (index_number, full_name, reg_no, department, amount_paid, amount_owed, status) VALUES (?,?,?,?,?,?,?)`, [index_number, full_name, reg_no, department, amount_paid||0, amount_owed||0, status||'Unpaid']);
    res.json(getQuery('SELECT * FROM students WHERE id = ?', [info.lastInsertRowid]));
  } catch(err){ res.status(400).json({ error: String(err) }); }
});
app.put('/api/students/:id', (req,res)=>{
  const id = req.params.id; const fields = req.body; const keys = Object.keys(fields);
  const sets = keys.map(k=>`${k} = ?`).join(', ');
  const params = keys.map(k=>fields[k]); params.push(id);
  runQuery(`UPDATE students SET ${sets} WHERE id = ?`, params);
  res.json(getQuery('SELECT * FROM students WHERE id = ?', [id]));
});
app.delete('/api/students/:id', (req,res)=>{ runQuery('DELETE FROM students WHERE id = ?', [req.params.id]); res.json({ ok: true }); });

// Events API
app.get('/api/events', (req,res)=> res.json(allQuery('SELECT * FROM events ORDER BY id DESC')));
app.post('/api/events', (req,res)=>{
  const { title, target, deadline, color } = req.body;
  const info = runQuery('INSERT INTO events (title,target,deadline,color) VALUES (?,?,?,?)', [title, target||0, deadline||null, color||null]);
  res.json(getQuery('SELECT * FROM events WHERE id = ?', [info.lastInsertRowid]));
});
app.put('/api/events/:id', (req,res)=>{
    const id = req.params.id;
    const { title, target, deadline, color } = req.body;
    runQuery('UPDATE events SET title = ?, target = ?, deadline = ?, color = ? WHERE id = ?', [title, target, deadline, color, id]);
    res.json(getQuery('SELECT * FROM events WHERE id = ?', [id]));
});
app.delete('/api/events/:id', (req,res)=>{
    const id = req.params.id;
    // Cascade logic: revert student balances
    const txns = allQuery('SELECT * FROM transactions WHERE event_id = ?', [id]);
    for(const t of txns) {
        runQuery('UPDATE students SET amount_paid = amount_paid - ?, amount_owed = amount_owed + ? WHERE id = ?', [t.amount, t.amount, t.student_id]);
    }
    runQuery('DELETE FROM transactions WHERE event_id = ?', [id]);
    runQuery('DELETE FROM events WHERE id = ?', [id]);
    res.json({ ok: true });
});

// Media API
app.get('/api/media', (req, res) => res.json(allQuery('SELECT * FROM media ORDER BY id DESC')));
app.post('/api/media', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.');
        const file = req.files.media;
        const uploadPath = path.join(__dirname, 'uploads', Date.now() + '_' + file.name);
        
        if(!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'));

        await file.mv(uploadPath);
        
        const info = runQuery('INSERT INTO media (title, filename, mimetype, size) VALUES (?, ?, ?, ?)', [
            req.body.title || 'Untitled',
            path.basename(uploadPath),
            file.mimetype,
            file.size
        ]);
        res.json(getQuery('SELECT * FROM media WHERE id = ?', [info.lastInsertRowid]));
    } catch (err) { res.status(500).send(err); }
});
app.delete('/api/media/:id', (req,res)=>{
    const item = getQuery('SELECT * FROM media WHERE id = ?', [req.params.id]);
    if(item) {
        const filePath = path.join(__dirname, 'uploads', item.filename);
        if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
        runQuery('DELETE FROM media WHERE id = ?', [req.params.id]);
    }
    res.json({ ok: true });
});
app.put('/api/media/:id', (req,res)=>{
    const id = req.params.id;
    const { title } = req.body;
    runQuery('UPDATE media SET title = ? WHERE id = ?', [title, id]);
    res.json(getQuery('SELECT * FROM media WHERE id = ?', [id]));
});

// Comments API
app.get('/api/comments', (req, res) => res.json(allQuery('SELECT * FROM comments ORDER BY id DESC')));
app.post('/api/comments', (req, res) => {
    const { author, comment } = req.body;
    const info = runQuery('INSERT INTO comments (author, comment) VALUES (?, ?)', [author || 'Anonymous', comment]);
    res.json(getQuery('SELECT * FROM comments WHERE id = ?', [info.lastInsertRowid]));
});

// Transactions API
app.get('/api/transactions', (req, res) => {
    res.json(allQuery(`
        SELECT t.*, s.full_name as studentName, s.index_number as studentIndex, e.title as eventName
        FROM transactions t
        JOIN students s ON t.student_id = s.id
        JOIN events e ON t.event_id = e.id
        ORDER BY t.id DESC
    `));
});
app.put('/api/comments/:id', (req, res) => {
    const id = req.params.id;
    const { comment } = req.body;
    runQuery('UPDATE comments SET comment = ? WHERE id = ?', [comment, id]);
    res.json(getQuery('SELECT * FROM comments WHERE id = ?', [id]));
});
app.delete('/api/comments/:id', (req, res) => {
    runQuery('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
});

// Summary API
app.get('/api/summary', (req, res) => {
    const funds = getQuery('SELECT SUM(amount) as total FROM transactions') || { total: 0 };
    const students = getQuery('SELECT COUNT(*) as count FROM students').count;
    const events = getQuery('SELECT COUNT(*) as count FROM events').count;
    const media = getQuery('SELECT COUNT(*) as count FROM media').count;
    res.json({ funds: funds.total || 0, students, events, media });
});

app.listen(PORT, () => console.log(`RT Funds API listening on http://localhost:${PORT}`));
