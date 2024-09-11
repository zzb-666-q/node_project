//配置层
const urls = 'http://127.0.0.1'
// const urls = "http://120.24.162.40";

//服务器基础配置
exports.BASE_SERVER_OPTIONS = {
  // HOST: "http://127.0.0.1",
  HOST: urls,
  PORT: 9000,
}
//上传文件的静态目录路径
exports.UPLOAD_URL = {
  // URL: "http://127.0.0.1:9000",
  URL: urls + ':9000',
  // URL: "http://120.24.162.40:9000",
}

//数据库配置
exports.MYSQL_OPTIONS = {
  DATABASE: 'serverdb',
  USER: 'root',
  // DATABASE: "server",
  // USER: "user",

  PASSWORD: 'root',
  // PASSWORD: '123456',
  // HOST: "localhost",
  HOST: '127.0.0.1',
  // HOST: "120.24.162.40",
  DIALECT: 'mysql',
  UNDERSCORED: true,
  TIMEZONE: '+08:00',
}
//邮件配置
exports.EMAIL_OPTIONS = {
  HOST: 'smtp.126.com',
  PORT: 465,
  SECURE: true,
  //邮箱
  // USER: 'kangliuyong@126.com',
  //授权码
  // PASS: 'IXAEPFHHFZMAEDWY'
  USER: 'zebinzheng2022@126.com',
  PASS: 'CVPUSMYAEZKGERFG',
}

//验证码配置
exports.VALIDCODE_OPTIONS = {
  //5分钟有效
  EXPIRES: 5 * 60 * 1000,
}

//token配置
exports.TOKEN_OPTIONS = {
  //加盐
  SALT: 'kang_$',
  //有效期
  EXPIRES: '1d',
}
