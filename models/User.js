/**
 * 根据schema创建Model  Model为一个构造函数
 */
const mongoose = require('mongoose');
const userSchema = require('../schemas/users');

const User = mongoose.model('User', userSchema);

module.exports = User;