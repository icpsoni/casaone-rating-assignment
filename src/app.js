const express = require('express');
require('dotenv').config();
const app = express();
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const ratingRoutes = require('./routers/ratingRoutes');

// Creating Server
const server = http.createServer(app);
// CORS Configuration
app.use('*', cors({ origin: true, credentials: true }));
// Using Body Parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Rating Routes
app.use('/', ratingRoutes);

// Exporting the Express Server
module.exports = server;
