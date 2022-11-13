const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Post = require('./postSchema');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.sendFile(path.resolve('./dist/index.html'));
  } catch (err) {
    next(err);
  }
});

router.get('/posts', async (req, res, next) => {
    const posts = Post.find().exec();
    return res.status(200).json(posts);
});

router.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(422).json({
        errors: {
          message: `No post with id ${req.params.id} found.`,
        },
      });
    }
    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

router.post('/posts', async (req, res, next) => {
  try {
    const createdPost = await Post.create(req.body);
    return res.status(201).json(createdPost);
  } catch (err) {
    next(err);
  }
});

router.delete('/posts/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId, {
      useFindAndModify: false,
    });
    if (!deletedPost) {
      return res.status(422).send({
        errors: {
          message: `No post with id: ${postId} was found.`,
        },
      });
    }
    return res.status(200).send(deletedPost);
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
