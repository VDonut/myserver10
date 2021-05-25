const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const Post = require('./postSchema');

require('dotenv').config();

const app = express();

const router = express.Router();

router.get('/posts', async (req, res, next) => {
  try {
    const posts = await Post.find().exec();
    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.post('/posts', async (req, res, next) => {
  try {
    console.log(req.body);
    const createdPost = await Post.create(req.body);
    return res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
});

app.use('/.netlify/functions/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message || 'Internal Server Error',
    },
  });
});

mongoose.set('useCreateIndex', true).connect(
  process.env.CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('Connected to Mongo Database')
);

module.exports.handler = serverless(app);
