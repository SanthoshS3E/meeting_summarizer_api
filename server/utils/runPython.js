import { spawn } from 'child_process';

export default function runPython(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [scriptPath, ...args]);
    let output = '';
    let error = '';

    python.stdout.on('data', data => output += data.toString());
    python.stderr.on('data', data => error += data.toString());

    python.on('close', code => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(error);
      }
    });
  });
}
