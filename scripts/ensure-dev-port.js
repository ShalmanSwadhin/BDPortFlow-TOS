/**
 * Frees the Vite dev port before startup when it is held by a stale Node process
 * (typically an orphaned `npm run dev` / Vite instance from a previous session).
 */
const { execSync } = require('child_process');

const PORT = Number(process.env.VITE_PORT || process.env.PORT || 3000);

function getListeningPids(port) {
  const pids = new Set();

  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr ":${port}"`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });

      for (const line of output.split(/\r?\n/)) {
        if (!line.includes('LISTENING')) continue;
        const parts = line.trim().split(/\s+/);
        const pid = Number.parseInt(parts[parts.length - 1], 10);
        if (Number.isFinite(pid) && pid > 0) pids.add(pid);
      }
      return [...pids];
    }

    const output = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    for (const line of output.split(/\r?\n/)) {
      const pid = Number.parseInt(line.trim(), 10);
      if (Number.isFinite(pid) && pid > 0) pids.add(pid);
    }
  } catch {
    return [];
  }

  return [...pids];
}

function getProcessName(pid) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      const match = output.match(/"([^"]+)"/);
      return match ? match[1].toLowerCase() : '';
    }

    const output = execSync(`ps -p ${pid} -o comm=`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return output.trim().toLowerCase();
  } catch {
    return '';
  }
}

function stopProcess(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      return;
    }
    process.kill(pid, 'SIGTERM');
  } catch (error) {
    console.error(`Failed to stop PID ${pid}: ${error.message}`);
    process.exit(1);
  }
}

const pids = getListeningPids(PORT).filter((pid) => pid !== process.pid);

if (pids.length === 0) {
  console.log(`Port ${PORT} is available.`);
  process.exit(0);
}

for (const pid of pids) {
  const name = getProcessName(pid);
  const isNode = name.includes('node');

  if (!isNode) {
    console.error(
      `Port ${PORT} is in use by ${name || 'unknown'} (PID ${pid}), not a Node/Vite process.`,
    );
    console.error(
      `Stop that process manually, then run npm run dev again.\n` +
        (process.platform === 'win32'
          ? `  netstat -ano | findstr ":${PORT}"\n  Stop-Process -Id ${pid} -Force`
          : `  lsof -i :${PORT}\n  kill ${pid}`),
    );
    process.exit(1);
  }

  console.warn(
    `Port ${PORT} held by stale Node process (PID ${pid}). Stopping it before Vite starts...`,
  );
  stopProcess(pid);
}

console.log(`Port ${PORT} is ready for Vite.`);
