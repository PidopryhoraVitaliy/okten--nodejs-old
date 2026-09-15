const http = require('node:http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        data: 'Hello World (by node server)!',
    }));
});

// // Create a local server to receive data from
// const server = http.createServer();
//
// // Listen to the request event
// server.on('request', (request, res) => {
//     res.writeHead(200, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({
//         data: 'test node server!',
//     }));
// });

server.listen(8000);
