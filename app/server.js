const http = require('http')
const app = require('./app')
const config = require('./config')

console.log(config)

const port = config.port;

const server = http.createServer(app);

server.listen(port);