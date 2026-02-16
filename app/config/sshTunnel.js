const { Client } = require('ssh2');
const net = require('net');
require('dotenv').config();

const createTunnel = () => {
    return new Promise((resolve, reject) => {
        if (!process.env.SSH_HOST) {
            console.log("SSH tunnel not configured. Skipping.");
            return resolve();
        }

        const sshClient = new Client();

        const sshConfig = {
            host: process.env.SSH_HOST,
            port: process.env.SSH_PORT || 22,
            username: process.env.SSH_USERNAME,
            password: process.env.SSH_PASSWORD,
        };

        const tunnelOptions = {
            srcHost: '127.0.0.1',
            srcPort: 3307,
            dstHost: process.env.DB_HOST || '127.0.0.1',
            dstPort: parseInt(process.env.DB_PORT, 10) || 3306,
        };

        const server = net.createServer((socket) => {
            sshClient.forwardOut(
                socket.remoteAddress,
                socket.remotePort,
                tunnelOptions.dstHost,
                tunnelOptions.dstPort,
                (err, stream) => {
                    if (err) {
                        console.error("SSH forwardOut error:", err);
                        return socket.end();
                    }
                    socket.pipe(stream);
                    stream.pipe(socket);
                    socket.on('close', () => {
                        stream.close();
                    });
                    stream.on('close', () => {
                        socket.end();
                    });
                }
            );
        });

        server.on('error', (err) => {
            console.error("Local server error:", err);
            sshClient.end();
            reject(err);
        });

        server.listen(tunnelOptions.srcPort, tunnelOptions.srcHost, () => {
            console.log(`Local tunnel server listening on ${tunnelOptions.srcHost}:${tunnelOptions.srcPort}`);
            sshClient.on('ready', () => {
                console.log('SSH client ready.');
                resolve();
            }).on('error', (err) => {
                console.error("SSH client connection error:", err);
                server.close();
                reject(err);
            }).connect(sshConfig);
        });
    });
};

module.exports = createTunnel;
