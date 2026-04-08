import chokidar from 'chokidar';
import { exec } from 'child_process';
import os from 'os';

const getLocalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const net of interfaces[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
};

const PORT = 3000;
const HOST = getLocalIp();

const watcher = chokidar.watch('src/**/*.{js,ts,tsx,css,pcss}', {
    ignored: /node_modules/,
    persistent: true,
});

watcher.on('change', (path) => {
    console.log(`File changed: ${path}`);
    exec(`npm run re-lint:dev`, (err, stdout, stderr) => {
        if (err) {
            console.error(stderr);
        } else {
            console.log(`🚀 (chokidar) Dev server running at: http://${HOST}:${PORT}`);
            console.warn(stdout);
        }
    });
});

console.log('Watching for file changes...');
