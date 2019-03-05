/**
 * 定义users数据表结构
 */
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = userSchema;