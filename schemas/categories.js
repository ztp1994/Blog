/**
 * 定义users数据表结构
 */
const mongoose = require('mongoose');
const categoriesSchema = new mongoose.Schema({
  name: String,
});

module.exports = categoriesSchema;