const server = require('./server');

const {
    PORT
} = process.env;

server.listen(PORT, () => console.log(`Service is running on port ${PORT}`));
