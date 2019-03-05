const express = require('express');
const router = express.Router();
const User = require('../models/User');
let responseData;
// 中间件其是一个函数，在响应发送之前对请求进行一些操作
router.use(function (req, res, next) {
	responseData = {
		code: 0,
		message: ''
	};
	next();
});

// 子路由规则
/**
 * 用户注册
 */
router.post('/user/register', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  if (!username || !password || !repassword) {
    responseData.code = 1;
    responseData.message = '用户名或密码不能为空！';
    res.json(responseData);
    return;
  }

  if (password !== repassword) {
    responseData.code=3;
    responseData.message='两次输入的密码不一致！';
    res.json(responseData);
    return;
  }

  // 在数据库中查找用户名是否存在
  User.findOne({
    username: username
  }).then(user => {
    if (user !== null) {
      responseData.code = 4;
      responseData.message = 'user is existed';
      res.json(responseData);
      return;
    }
    // new user into Data
    const newUser = new User({
      username: username,
      password: password
    });
    newUser.save()
        .then(userInfo => {
          console.log(userInfo);
          responseData.message = 'user register success!';
          responseData.code = 0;
          res.json(responseData);
        })
  })
});

/**
 *
 * 用户登陆
 */
router.post('/user/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    responseData.message = "用户名或密码不能为空！";
    responseData.code = 1;
    res.json(responseData);
    return;
  }

  // 查找用户
  User.findOne({
    username: username,
    password: password
  }).then(user => {
    if (user == null) {
      responseData.code = 2;
      responseData.message = "用户名或密码错误！";
      res.json(responseData);
      return;
    }
    console.log('login success：' + username);
    responseData.code = 0;
    responseData.message = "用户登陆成功！";
    // 返回用户信息
    responseData.userInfo = {
      id: user._id,
      username: user.username
    };
    // 将用户信息放入cookie中
    req.cookies.set('userInfo',JSON.stringify({
      _id: user._id,
      username: user.username
    }));

    res.json(responseData);
  });
});

/**
 * 用户注销
 */
router.get('/user/logout', (req, res, next) => {
  req.cookies.set('userInfo', null);
  console.log('user logout!：' + req.userInfo.username);
  responseData.message = '用户注销成功！';
  responseData.code = 0;
  res.json(responseData);
});
module.exports = router;