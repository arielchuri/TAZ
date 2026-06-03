// API route handlers for the Give & Take board.
// Reads and writes to server/data/skills.json and server/data/needs.json.
//
// GET  /api/skills  — return all offer entries
// POST /api/skills  — append a new offer entry
// GET  /api/needs   — return all need/request entries
// POST /api/needs   — append a new need/request entry
//
// Expected shape for both skills and needs:
// {
//   id:          string (uuid)
//   type:        "labor" | "supplies"
//   category:    string — one of the options in client/src/categories.js
//   title:       string
//   description: string (optional)
//   postedBy:    string
//   urgent:      boolean (needs only)
//   postedAt:    ISO timestamp
// }

const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const router = express.Router();

const file = (name) => path.join(__dirname, '..', 'data', name);
const read = (name) => JSON.parse(fs.readFileSync(file(name), 'utf8'));
const write = (name, data) =>
  fs.writeFileSync(file(name), JSON.stringify(data, null, 2));

// Append a new entry (with generated id + timestamp) to the given data file.
function makePost(filename) {
  return (req, res) => {
    const entries = read(filename);
    const entry = {
      id: uuid(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    entries.push(entry);
    write(filename, entries);
    res.status(201).json(entry);
  };
}

router.get('/skills', (_req, res) => res.json(read('skills.json')));
router.post('/skills', makePost('skills.json'));

router.get('/needs', (_req, res) => res.json(read('needs.json')));
router.post('/needs', makePost('needs.json'));

// Mark an entry as pending (someone has reached out about it).
// Body: { id: string, type: 'skill' | 'need' }
router.post('/connect', (req, res) => {
  const { id, type } = req.body;
  const filename = type === 'skill' ? 'skills.json' : 'needs.json';
  const entries = read(filename);
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Entry not found' });
  entries[idx].pending = true;
  write(filename, entries);
  res.json(entries[idx]);
});

module.exports = router;
