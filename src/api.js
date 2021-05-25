const express = require('express');
const serverless = require('serverless-http');

const app = express();

const router = express.Router();

router.get('/posts', (req, res) => {
  res.json({ content: process.env.CONNECTION_STRING });
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
