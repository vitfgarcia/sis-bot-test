const express = require('express');
const bodyParser = require('body-parser');

const healthRouter = require('./routes/health');
const botRouter = require('./routes/bots');
const messageRouter = require('./routes/messages');

const server = express();

// Add Middlewares
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Setup Routers
server.use('/health', healthRouter);
server.use('/bots', botRouter);
server.use('/messages', messageRouter);

module.exports = server;
