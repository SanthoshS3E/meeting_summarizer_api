// utils/transcribe.js
import { spawn } from 'child_process';
import path from 'path';

export async function transcribeAudio(filePath) {
  return new Promise((resolve, reject) => {
    const pythonPath = 'python'; // or full path to python.exe if needed
    const scriptPath = path.join('python', 'transcribe.py');
    
    const process = spawn(pythonPath, [scriptPath, filePath]);

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        console.error('Python error output:', errorOutput);
        reject('Transcription failed');
      }
    });
  });
}
