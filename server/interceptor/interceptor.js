//拦截器

const path = require("path");

let whiteList = require(path.resolve(__basename, "whiteList/whiteList.js"));
let utils = require(path.resolve(__basename, "utils/utils.js"));

module.exports = (app) => {
  //处理OPTIONS(浏览器嗅探服务器支持的请求类型)
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      return res.send(true);
    }
    next();
  });

  //验证码验证拦截器
  app.use((req, res, next) => {


    if (whiteList.validCodeWhiteList.indexOf(req.url) > -1) {
      //   console.log("req.method ==> ", req.method);
      // console.log("req.body ==> ", req.body);
      //根据validCodeId查询验证码数据
      model.ValidCode.findOne({
        attributes: ["validCode", "createdAt"],
        // attributes: ["email", "validCode", "createdAt"],
        where: {
          validCodeId: req.body.validCodeId,
        },
      })
        .then((result) => {
          console.log("result12333 ==> ", result);
          //邮箱、验证码、时间三个条件必须同时成立
          // if (result.dataValues.email !== req.body.email) {
          //   return res.send({ msg: "接收验证码邮箱不正确", code: 500 });
          // }

          if (result.dataValues.validCode !== req.body.validCode) {
            return res.send({ msg: "验证码不正确", code: 500 });
          }

          let currentTime = new Date().getTime();
          let createdAt = new Date(result.dataValues.createdAt).getTime();
          let time = currentTime - createdAt;
          if (time > CONFIG.VALIDCODE_OPTIONS.EXPIRES) {
            return res.send({ msg: "验证码已失效", code: 500 });
          }

          //验证验证通过, 继续访问下一个中间件或者路由
          next();
        })
        .catch((err) => {
          console.log("err ==> ", err);
          res.send({ msg: "验证失败", code: 500 });
        });
    } else {
      console.log("无需验证验证码");
      next();
    }
  });

  //拦截token, 登录验证
  app.use((req, res, next) => {
    // console.log('req.url ==> ', req.url);

    let url = req.url;

    if (req.method === "GET") {
      url = url.split("?")[0];
    }

    if (whiteList.tokenWhiteList.indexOf(url) > -1) {
      //验证token
      utils
        .verifyToken(req.headers.token)
        .then((result) => {
          console.log("result ==> ", result);
          //将用户userId传递
          req.userId = result.data;
          next();
        })
        .catch((err) => {
          res.send({ msg: "登录状态已过期，您可以继续留在该页面，或者重新登录", code: 401 });
        });
    } else {
      console.log("无需验证token");
      next();
    }
  });
};
