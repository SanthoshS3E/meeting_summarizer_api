import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { spawn } from 'child_process';

import authRoutes from './routes/auth.js';
import transcribeRoute from './routes/transcribe.js';
import { verifyToken } from './middleware/auth.js';
import { initDB } from './db.js';  // ✅ now used for saving summaries

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ Public routes
app.use('/auth', authRoutes);

// ✅ Protected audio transcription route
app.use('/transcribe', verifyToken, transcribeRoute);

// ✅ Summarize plain text & SAVE in DB
app.post('/summarize', verifyToken, async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ success: false, message: 'transcript field is required' });
  }

  console.log('📝 Summarizing text length:', transcript.length);

  const python = spawn('python', ['server/python/summarize.py']);
  let dataToSend = '';

  python.stdin.write(JSON.stringify({ transcript }));
  python.stdin.end();

  python.stdout.on('data', (data) => {
    dataToSend += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error('[Summarize stderr]', data.toString());
  });

  python.on('close', async (code) => {
  console.log("✅ Python closed with code:", code);
  console.log("✅ Raw Python output:", dataToSend.trim());

  if (code !== 0) {
    console.error('❌ Summarizer exited with code', code);
    return res.status(500).json({ success: false, message: 'Summarizer failed' });
  }

  try {
    const parsed = JSON.parse(dataToSend.trim());
    console.log("✅ Parsed summary:", parsed.summary);

    console.log("✅ Saving summary for user:", req.user.id);
    const db = await initDB();
    const result = await db.run(
      `INSERT INTO summaries (user_id, type, original_text, summary)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, 'notes', transcript, parsed.summary]
    );
    console.log("✅ DB insert result:", result);

    return res.json({ success: true, summary: parsed.summary });

  } catch (err) {
    console.error('[Parse Error] Could not parse:', dataToSend.trim());
    console.error(err);
    return res.status(500).json({ success: false, message: 'Invalid summarizer output' });
  }
});

});

// ✅ Fetch user history (last 10 summaries)
app.get('/history', verifyToken, async (req, res) => {
  const db = await initDB();
  const rows = await db.all(
    `SELECT id, type, summary, created_at
     FROM summaries
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 10`,
    [req.user.id]
  );

  res.json({ success: true, history: rows });
});

// ✅ Protected dashboard (optional JSON)
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.email}`,
    options: ['Meeting Summaries', 'Review of Meetings']
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
