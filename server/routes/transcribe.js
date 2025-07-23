import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import { initDB } from '../db.js'; // ✅ to save DB
import { fileURLToPath } from 'url';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded' });
    }

    const audioPath = req.file.path;

    console.log("🎙️ Received audio:", audioPath);

    // STEP 1: Run Whisper (transcribe)
    const whisperProcess = spawn('python', [
      path.resolve(__dirname, '../python/transcribe.py'),
      audioPath
    ]);

    let whisperOutput = '';
    whisperProcess.stdout.on('data', (data) => {
      whisperOutput += data.toString();
    });

    whisperProcess.stderr.on('data', (data) => {
      console.error('[Whisper stderr]', data.toString());
    });

    whisperProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ success: false, message: 'Whisper failed' });
      }

      let transcript = '';
      try {
        const parsed = JSON.parse(whisperOutput.trim());
        transcript = parsed.text;
      } catch (err) {
        console.error("❌ Failed parsing Whisper output:", whisperOutput);
        return res.status(500).json({ success: false, message: 'Error parsing Whisper output' });
      }

      console.log("✅ Transcription complete, length:", transcript.length);

      // STEP 2: Run summarize.py on transcript
      const summarizeProcess = spawn('python', [
        path.resolve(__dirname, '../python/summarize.py')
      ]);

      let summaryOutput = '';
      summarizeProcess.stdout.on('data', (data) => {
        summaryOutput += data.toString();
      });

      summarizeProcess.stderr.on('data', (data) => {
        console.error('[Summarize stderr]', data.toString());
      });

      summarizeProcess.on('close', async (code) => {
        if (code !== 0) {
          return res.status(500).json({ success: false, message: 'Summarizer failed' });
        }

        try {
          const parsedSummary = JSON.parse(summaryOutput.trim());

          // ✅ Save in DB
          const db = await initDB();
          await db.run(
            `INSERT INTO summaries (user_id, type, original_text, summary)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, 'audio', transcript, parsedSummary.summary]
          );

          return res.json({
            success: true,
            transcript,
            summary: parsedSummary.summary
          });

        } catch (err) {
          console.error("❌ Error parsing summarize.py output:", summaryOutput);
          return res.status(500).json({ success: false, message: 'Invalid summarizer output' });
        }
      });

      // send transcript to summarizer
      summarizeProcess.stdin.write(JSON.stringify({ transcript }));
      summarizeProcess.stdin.end();
    });

  } catch (err) {
    console.error("Unexpected error in /transcribe:", err);
    return res.status(500).json({ success: false, message: 'Internal error' });
  }
});

export default router;
