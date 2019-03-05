/**
 * 根据schema创建Model  Model为一个构造函数
 */
const mongoose = require('mongoose');
const categoriesSchema = require('../schemas/categories');

const Category = mongoose.model('Category', categoriesSchema);

module.exports = Category;