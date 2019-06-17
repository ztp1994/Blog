/**
 * 应用程序入口
 */
const express = require('express');
const swig = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require('cookies');
const User = require('./models/User');
//
const app = express();

// 应用使用模板引擎  指定html文件
app.engine('html', swig.renderFile);
// 指定模板存放目录
app.set('views', './views');
// 注册使用模板引擎
app.set('view engine', 'html');
// 开发中关闭模板缓存
swig.setDefaults({ cache: false });

// bodyParser中间件用来解析http post请求体
app.use(bodyParser.urlencoded({extended: true}));

// 设置中间件  设置cookie
app.use(function(req,res,next){
  req.cookies=new Cookies(req,res);

  req.userInfo={};
  // 如果请求的cookie中存在userInfo
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));

      // 进行用户admin判断
      User.findById(req.userInfo._id)
          .then(user => {
            req.userInfo.isAdmin = Boolean(user.isAdmin);
            // 中间件处理完事物再next
            next();
          })
    } catch (e) {
      throw e;
    }
  }else{
    next();
  }
});

// 设置静态资源请求目录 当请求的url是以/public开头的 就发送给前端静态文件
app.use('/public', express.static( __dirname + '/public' ));

// 设置路由规则  子路由  /  /api /admin 三个模块
app.use('/', require('./routers/main'));
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));

// 链接mongo数据库
mongoose.connect('mongodb://localhost:27017/blog',{ useNewUrlParser: true },err => {
	if (err) {
		throw err;
	} else {
		console.log('mongoDB connect success!');
	}
});

// 监听端口
app.listen(8081,'0.0.0.0',()=>{
  console.log('app is running 8081 port!');
});
