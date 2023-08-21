const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    logo:{
        type:String,
        default:'https://static.vecteezy.com/system/resources/thumbnails/002/595/744/small/people-team-community-and-partnership-line-icon-free-vector.jpg'
    },
    name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  created_by: {
    type: String,
    ref: 'study_model'
  },
  members: [{
    type: String,
    ref: 'study_model'
  }],
  posts: [{
    type: String,
    ref: 'PostDB'
  }]
});

const MongooseModel = mongoose.model('Community', userSchema);

module.exports = MongooseModel;