const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: false },
    body: { type: String, required: false },
    author: { type: String, default: 'Unknown' },
    categories: { type: Array, default: [] },
    imgUrl: { type: String, default: null }
  },
  { collection: 'posts' }
);

module.exports = mongoose.model('Post', postSchema);
