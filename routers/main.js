const express = require('express');
const router = express.Router();

// 子路由规则
router.get('/', (req, res, next) => {
	// 渲染主页
  res.render('main/index', {
    userInfo: req.userInfo
  });
});

module.exports = router;