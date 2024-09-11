global.__basename = __dirname;

const path = require("path");


global.CONFIG = require(path.resolve(__basename, "config/config.js"));

const bodyParser = require("body-parser");

const express = require("express");

let app = express();

let routes = require(path.resolve(__basename, "routes/routes.js"));

let interceptor = require(path.resolve(
  __basename,
  "interceptor/interceptor.js"
));

//连接数据库
global.sequelize = require(path.resolve(__basename, "db/connect.js"));
//导入模型
global.model = require(path.resolve(__basename, "db/model.js"));
//导入uuid
global.uuid = require("uuid");


//导入jsonwebtoken
global.jsonwebtoken = require("jsonwebtoken");
//解析请求体
app.use(bodyParser.urlencoded({ extended: false, limit: "2048kb" }));
app.use(bodyParser.json({ limit: "2048kb" }));


//设置静态目录
app.use(express.static(path.resolve(__basename, "upload")));

app.all("*", (req, res, next) => {
  //允许跨域地址
  // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:9000");

  //*表示允许所有域请求，此时无法实现跨域携带cookie, 在实际开发中，一般指定允许某个域请求，如上面设置
  res.header("Access-Control-Allow-Origin", "*");

  //动态允许跨域地址, 实现效果和 * 一样,  但可以实现跨域携带cookie
  // res.header("Access-Control-Allow-Origin", req.headers.origin);

  //如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, content-type,token"
  );

  //该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

  //该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可
  // res.header('Access-Control-Allow-Credentials', true);

  next();
});

//加载拦截器
interceptor(app);
//加载路由
routes(app);

app.listen(CONFIG.BASE_SERVER_OPTIONS.PORT);
