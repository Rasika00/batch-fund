const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Initialize DB
const dbPath = path.join(__dirname, 'data', 'db.sqlite');
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
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
app.get('/api/students', (req, res) => {
  const rows = allQuery('SELECT * FROM students ORDER BY id DESC');
  res.json(rows);
});

app.get('/api/students/:id', (req,res)=>{
  const row = getQuery('SELECT * FROM students WHERE id = ?', [req.params.id]);
  res.json(row || {});
});

app.post('/api/students', (req,res)=>{
  const { index_number, full_name, reg_no, department, amount_paid, amount_owed, status } = req.body;
  try {
    const info = runQuery(`INSERT INTO students (index_number, full_name, reg_no, department, amount_paid, amount_owed, status) VALUES (?,?,?,?,?,?,?)`, [index_number, full_name, reg_no, department, amount_paid||0, amount_owed||0, status||'Unpaid']);
    const created = getQuery('SELECT * FROM students WHERE id = ?', [info.lastInsertRowid]);
    res.json(created);
  } catch(err){ res.status(400).json({ error: String(err) }); }
});

app.put('/api/students/:id', (req,res)=>{
  const id = req.params.id;
  const fields = req.body;
  const keys = Object.keys(fields);
  if(keys.length===0) return res.status(400).json({error:'no fields'});
  const sets = keys.map(k=>`${k} = ?`).join(', ');
  const params = keys.map(k=>fields[k]);
  params.push(id);
  try {
    runQuery(`UPDATE students SET ${sets} WHERE id = ?`, params);
    res.json(getQuery('SELECT * FROM students WHERE id = ?', [id]));
  } catch(err){ res.status(400).json({ error: String(err) }); }
});

app.delete('/api/students/:id', (req,res)=>{
  runQuery('DELETE FROM students WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// Events API
app.get('/api/events', (req,res)=> res.json(allQuery('SELECT * FROM events ORDER BY id DESC')));
app.post('/api/events', (req,res)=>{
  const { title, target, deadline, color } = req.body;
  const info = runQuery('INSERT INTO events (title,target,deadline,color) VALUES (?,?,?,?)', [title, target||0, deadline||null, color||null]);
  res.json(getQuery('SELECT * FROM events WHERE id = ?', [info.lastInsertRowid]));
});
app.put('/api/events/:id', (req,res)=>{
  const id=req.params.id; const fields=req.body; const keys=Object.keys(fields); if(keys.length===0) return res.status(400).json({error:'no fields'});
  const sets = keys.map(k=>`${k} = ?`).join(', ');
  const params = keys.map(k=>fields[k]); params.push(id);
  runQuery(`UPDATE events SET ${sets} WHERE id = ?`, params);
  res.json(getQuery('SELECT * FROM events WHERE id = ?', [id]));
});
app.delete('/api/events/:id',(req,res)=>{ runQuery('DELETE FROM events WHERE id = ?', [req.params.id]); res.json({ok:true}); });

// Transactions API
app.get('/api/transactions',(req,res)=> res.json(allQuery('SELECT t.*, s.full_name as student_name, e.title as event_title FROM transactions t LEFT JOIN students s ON s.id = t.student_id LEFT JOIN events e ON e.id = t.event_id ORDER BY t.id DESC')));
app.post('/api/transactions',(req,res)=>{
  const { student_id, event_id, method, amount, status } = req.body;
  const info = runQuery('INSERT INTO transactions (student_id,event_id,method,amount,status) VALUES (?,?,?,?,?)', [student_id, event_id, method||'Cash', amount||0, status||'Completed']);
  const created = getQuery('SELECT * FROM transactions WHERE id = ?', [info.lastInsertRowid]);
  res.json(created);
});
app.put('/api/transactions/:id',(req,res)=>{
  const id=req.params.id; const fields=req.body; const keys=Object.keys(fields); if(keys.length===0) return res.status(400).json({error:'no fields'});
  const sets = keys.map(k=>`${k} = ?`).join(', ');
  const params = keys.map(k=>fields[k]); params.push(id);
  runQuery(`UPDATE transactions SET ${sets} WHERE id = ?`, params);
  res.json(getQuery('SELECT * FROM transactions WHERE id = ?', [id]));
});
app.delete('/api/transactions/:id',(req,res)=>{ runQuery('DELETE FROM transactions WHERE id = ?', [req.params.id]); res.json({ok:true}); });

// Summary endpoint
app.get('/api/summary',(req,res)=>{
  const total = getQuery('SELECT SUM(amount) as total FROM transactions') || { total: 0 };
  const studentsCount = getQuery('SELECT COUNT(*) as c FROM students').c;
  res.json({ total: total.total || 0, students: studentsCount });
});

app.listen(PORT, ()=> console.log(`RT Funds API listening on http://localhost:${PORT}`));
