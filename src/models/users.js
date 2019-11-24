const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const users = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Users = mongoose.model('Users', users);

module.exports = Users;

