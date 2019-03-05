const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');

// 中间件 admin权限检验
router.use(function (req, res, next) {
  if (!req.userInfo.isAdmin) {
    res.send('对不起，没有权限访问管理员界面！');
    return;
  }
  next();
});

// 子路由规则
/**
 * 后台管理主页
 */
router.get('/', (req, res, next) => {
  res.render('admin/index', {userInfo: req.userInfo});
});

/**
 * 用户列表  分页
 */
router.get('/user', (req, res, next) => {
  let page = Number(req.query.page || 1);
  const limit = 5;
  let pages = 0;

  // 查询总用户数
  User.countDocuments()
      .then(count => {
        pages = Math.ceil(count / limit);
        page = Math.max(page, 1);
        page = Math.min(page, pages);
        const skip = (page - 1) * limit;

        // 获取分页用户列表
        User.find().limit(limit).skip(skip)
            .then(users => {
              res.render('admin/user_index', {
                userInfo: req.userInfo,
                users: users,
                count,
                limit,
                page,
                pages
              })
            });
      });

});

/**
 * 分类首页
 */
router.get('/category', (req, res, next) => {
  let page = Number(req.query.page || 1);
  const limit = 5;
  let pages = 0;

  // 查询总用户数
  Category.countDocuments()
      .then(count => {
        pages = Math.ceil(count / limit);
        page = Math.max(page, 1);
        page = Math.min(page, pages);
        const skip = (page - 1) * limit;

        // 获取分页用户列表
        Category.find().limit(limit).skip(skip)
            .then(categories => {
              res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories,
                count,
                limit,
                page,
                pages
              })
            });
      });
});

/**
 * 添加分类页面
 */
router.get('/category/add', (req, res, next) => {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  });
});
/**
 * 添加分类 数据 add
 */
router.post('/category/add', (req, res, next) => {
  const name = req.body.name;
  if (!name) {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '分类名称不能为空！'
    });
    return;
  }
  // 查找是否存在同名的分类
  Category.findOne({
    name: name
  }).then(category => {
    if (category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '存在同名分类'
      });
      return Promise.reject();
    } else {
      return new Category({name: name}).save();
    }
  })
      .then(newCategory => {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '分类保存成功',
          url: '/admin/category'
        })
      });
});

/**
 * 分类修改  edit
 */
router.get('/category/edit', (req, res, next) => {
  const id = req.query.id || '';

  // 查找要修改分类
  Category.findOne({_id: id})
      .then(category => {
        if (!category) {
          res.render('admin/error', {
            userInfo: req.userInfo,
            message: '查找的分类不存在'
          });
          return Promise.reject();
        } else {
          res.render('admin/category_edit', {
            userInfo: req.userInfo,
            category
          });
        }
      });
});

/**
 * 分类修改保存  edit save
 */
router.post('/category/edit', (req, res, next) => {
  const id = req.query.id || '';
  const name = req.body.name;

  // 查找要修改分类
  Category.findOne({_id: id})
      .then(category => {
        if (!category) {
          res.render('admin/error', {
            userInfo: req.userInfo,
            message: '分类不存在'
          });
          return Promise.reject();
        } else {
          // 用户未修改名称
          if (name === category.name) {
            res.render('admin/error', {
              userInfo: req.userInfo,
              message: '名称未作改动！'
            });
            return Promise.reject();
          } else {
            // 修改的分类名称是否数据库是否已经存在
            return Category.findOne({
              _id: {$ne: id},
              name: name
            });
          }
        }
      })
      .then(sameCategory => {
        if (sameCategory) {
          res.render('admin/error', {
            userInfo: req.userInfo,
            message: '已存在同名分类'
          });
          return Promise.reject();
        } else {
          return Category.update({
            _id: id
          }, {
            name: name
          })
        }
      })
      .then(() => {
        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '分类名称修改成功！',
          url: '/admin/category'
        });
      })
});

/**
 * 分类的删除  delete
 */
router.get('/category/delete', (req, res, next) => {
  const id = req.query.id || '';
  // 查找并删除
  Category.remove({
    _id: id
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类删除成功',
      url: '/admin/category'
    });
  });
});


module.exports = router;