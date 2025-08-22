import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';

const app = express();
const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

const upload = multer({ dest: uploadsDir });

// SQLite database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  image TEXT,
  ingredients TEXT,
  occasions TEXT,
  preferences TEXT,
  favorite INTEGER DEFAULT 0,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS calendar (
  id INTEGER PRIMARY KEY,
  todayRecipeId INTEGER,
  plannedIds TEXT
);
`);

// Seed database from db.json if empty
const recipeCount = db.prepare('SELECT COUNT(*) as count FROM recipes').get().count;
if (recipeCount === 0) {
  const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'));
  const insertRecipe = db.prepare(`INSERT INTO recipes (id, name, description, image, ingredients, occasions, preferences, favorite, createdAt)
    VALUES (@id, @name, @description, @image, @ingredients, @occasions, @preferences, @favorite, @createdAt)`);
  const insertMany = db.transaction((recipes) => {
    for (const r of recipes) {
      insertRecipe.run({
        id: r.id,
        name: r.name,
        description: r.description,
        image: r.image || null,
        ingredients: JSON.stringify(r.ingredients || []),
        occasions: JSON.stringify(r.occasions || []),
        preferences: JSON.stringify(r.preferences || []),
        favorite: r.favorite ? 1 : 0,
        createdAt: r.createdAt
      });
    }
  });
  insertMany(seed.recipes);
  db.prepare(`INSERT OR REPLACE INTO calendar (id, todayRecipeId, plannedIds) VALUES (1, @todayRecipeId, @plannedIds)`)
    .run({ todayRecipeId: seed.calendar.todayRecipeId, plannedIds: JSON.stringify(seed.calendar.plannedIds || []) });
}

function rowToRecipe(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    ingredients: JSON.parse(row.ingredients || '[]'),
    occasions: JSON.parse(row.occasions || '[]'),
    preferences: JSON.parse(row.preferences || '[]'),
    favorite: !!row.favorite,
    createdAt: row.createdAt
  };
}

// Recipe routes
app.get('/recipes', (req, res) => {
  const rows = db.prepare('SELECT * FROM recipes').all();
  res.json(rows.map(rowToRecipe));
});

app.get('/recipes/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).end();
  res.json(rowToRecipe(row));
});

app.post('/recipes', upload.single('image'), (req, res) => {
  const data = req.body;
  const file = req.file;
  const imagePath = file ? `/uploads/${file.filename}` : data.image || null;
  const stmt = db.prepare(`INSERT INTO recipes (name, description, image, ingredients, occasions, preferences, favorite, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  const result = stmt.run(
    data.name,
    data.description,
    imagePath,
    JSON.stringify(data.ingredients ? JSON.parse(data.ingredients) : []),
    JSON.stringify(data.occasions ? JSON.parse(data.occasions) : []),
    JSON.stringify(data.preferences ? JSON.parse(data.preferences) : []),
    data.favorite === 'true' || data.favorite === true || data.favorite === '1' ? 1 : 0,
    new Date().toISOString()
  );
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(rowToRecipe(row));
});

app.patch('/recipes/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const existing = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!existing) return res.status(404).end();
  const data = req.body;
  const file = req.file;
  const imagePath = file ? `/uploads/${file.filename}` : (data.image || existing.image);
  const stmt = db.prepare(`UPDATE recipes SET name = ?, description = ?, image = ?, ingredients = ?, occasions = ?, preferences = ?, favorite = ? WHERE id = ?`);
  stmt.run(
    data.name ?? existing.name,
    data.description ?? existing.description,
    imagePath,
    JSON.stringify(data.ingredients ? JSON.parse(data.ingredients) : JSON.parse(existing.ingredients)),
    JSON.stringify(data.occasions ? JSON.parse(data.occasions) : JSON.parse(existing.occasions)),
    JSON.stringify(data.preferences ? JSON.parse(data.preferences) : JSON.parse(existing.preferences)),
    data.favorite !== undefined
      ? (data.favorite === 'true' || data.favorite === true || data.favorite === '1' ? 1 : 0)
      : existing.favorite,
    id
  );
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  res.json(rowToRecipe(row));
});

app.delete('/recipes/:id', (req, res) => {
  const info = db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).end();
  res.status(204).end();
});

// Calendar routes
app.get('/calendar', (req, res) => {
  const row = db.prepare('SELECT * FROM calendar WHERE id = 1').get();
  if (!row) return res.json({ todayRecipeId: null, plannedIds: [] });
  res.json({ todayRecipeId: row.todayRecipeId, plannedIds: JSON.parse(row.plannedIds || '[]') });
});

app.patch('/calendar', (req, res) => {
  const { todayRecipeId, plannedIds } = req.body;
  const exists = db.prepare('SELECT COUNT(*) as c FROM calendar WHERE id = 1').get().c;
  if (exists) {
    db.prepare('UPDATE calendar SET todayRecipeId = ?, plannedIds = ? WHERE id = 1')
      .run(todayRecipeId, JSON.stringify(plannedIds || []));
  } else {
    db.prepare('INSERT INTO calendar (id, todayRecipeId, plannedIds) VALUES (1, ?, ?)')
      .run(todayRecipeId, JSON.stringify(plannedIds || []));
  }
  const row = db.prepare('SELECT * FROM calendar WHERE id = 1').get();
  res.json({ todayRecipeId: row.todayRecipeId, plannedIds: JSON.parse(row.plannedIds || '[]') });
});

// Image upload only
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

