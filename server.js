const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

// Serve static assets
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname)); // fallback to root

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext) {
      if (file.mimetype && file.mimetype.includes('audio')) ext = '.webm';
      else ext = '.jpg';
    }
    const uniqueName = `birthday_${Date.now()}_${Math.round(Math.random() * 1e5)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for audio & photos
});

// JSON File Helpers
function readJson(filename, defaultVal = []) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf8');
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultVal;
  }
}

function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

/* ==========================================================================
   REST API ENDPOINTS
   ========================================================================== */

// 1. Celebration Metadata (Birthday Star Info, Date, Theme)
app.get('/api/celebration', (req, res) => {
  const data = readJson('celebration.json', {
    name: 'Birthday Star',
    tagline: 'Today calls for a grand celebration!',
    message: 'May your year be filled with boundless joy, unforgettable adventures, and giant slices of cake.',
    targetDate: '2026-10-01T20:00:00',
    theme: 'sunset'
  });
  res.json({ success: true, data });
});

app.put('/api/celebration', (req, res) => {
  const current = readJson('celebration.json', {});
  const updated = {
    ...current,
    name: req.body.name || current.name || 'Birthday Star',
    age: req.body.age !== undefined ? req.body.age : current.age,
    tagline: req.body.tagline || current.tagline,
    message: req.body.message || current.message,
    targetDate: req.body.targetDate || current.targetDate,
    theme: req.body.theme || current.theme || 'royal',
    updatedAt: new Date().toISOString()
  };
  writeJson('celebration.json', updated);
  res.json({ success: true, data: updated, message: 'Celebration profile updated!' });
});

// 2. Live Wishes Guestbook API
app.get('/api/wishes', (req, res) => {
  const wishes = readJson('wishes.json', []);
  // Return newest first
  res.json({ success: true, count: wishes.length, data: wishes });
});

app.post('/api/wishes', (req, res) => {
  const { name, message, emoji, audioUrl } = req.body;
  if (!name || (!message && !audioUrl)) {
    return res.status(400).json({ success: false, error: 'Name and a message or voice note are required' });
  }

  const wishes = readJson('wishes.json', []);
  const newWish = {
    id: `wish_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: name.trim().slice(0, 40),
    message: (message || 'Sent a voice wish! 🎙️').trim().slice(0, 500),
    emoji: emoji || '🎉',
    audioUrl: audioUrl || null,
    likes: 0,
    timestamp: new Date().toISOString()
  };

  wishes.unshift(newWish); // Prepend to top
  writeJson('wishes.json', wishes);
  res.status(201).json({ success: true, data: newWish, message: 'Wish posted to the wall!' });
});

app.delete('/api/wishes/:id', (req, res) => {
  const id = req.params.id;
  const wishes = readJson('wishes.json', []);
  const filtered = wishes.filter(w => w.id !== id);
  writeJson('wishes.json', filtered);
  res.json({ success: true, message: 'Wish deleted' });
});

// 3. File (Photo / Audio Voice Note) Upload Endpoint
app.post('/api/upload', upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  const file = req.files[0];
  const fileUrl = `/uploads/${file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: file.filename,
    mimetype: file.mimetype,
    message: 'File uploaded successfully!'
  });
});

// 4. RSVP Attendees API
app.get('/api/rsvps', (req, res) => {
  const rsvps = readJson('rsvps.json', []);
  res.json({ success: true, count: rsvps.length, data: rsvps });
});

app.post('/api/rsvps', (req, res) => {
  const { name, status, message } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  const rsvps = readJson('rsvps.json', []);
  const newRsvp = {
    id: `rsvp_${Date.now()}`,
    name: name.trim().slice(0, 40),
    status: status || 'Attending',
    message: (message || '').trim().slice(0, 150),
    timestamp: new Date().toISOString()
  };
  rsvps.unshift(newRsvp);
  writeJson('rsvps.json', rsvps);
  res.status(201).json({ success: true, data: newRsvp, message: 'RSVP confirmed!' });
});

// 5. Celebration Stats
app.get('/api/stats', (req, res) => {
  const wishes = readJson('wishes.json', []);
  const rsvps = readJson('rsvps.json', []);
  res.json({
    success: true,
    totalWishes: wishes.length,
    totalRsvps: rsvps.length,
    attendingCount: rsvps.filter(r => r.status === 'Attending').length
  });
});

// Fallback catch-all route for SPA
app.use((req, res) => {
  const publicIndex = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ The Grand Birthday Gala Server running at http://localhost:${PORT}`);
});
