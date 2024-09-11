//工具库
const nodemailer = require('nodemailer');
const tinify = require('tinify');
const crypto = require('crypto');

const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
var image = require('imageinfo');

//读取文件信息
function readFileList(path, filesList) {
  var files = fs.readdirSync(path);
  files.forEach(function (itm, index) {
    var stat = fs.statSync(path + itm);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + itm + '/', filesList);
    } else {
      var obj = {}; //定义一个对象存放文件的路径和名字
      obj.path = path; //路径
      obj.filename = itm; //名字
      filesList.push(obj);
    }
  });
}

//发送邮件
let transporter = nodemailer.createTransport({
  host: CONFIG.EMAIL_OPTIONS.HOST,
  port: CONFIG.EMAIL_OPTIONS.PORT,
  secure: CONFIG.EMAIL_OPTIONS.SECURE, // true for 465, false for other ports
  auth: {
    user: CONFIG.EMAIL_OPTIONS.USER,
    pass: CONFIG.EMAIL_OPTIONS.PASS,
  },
});

class Utils {
  constructor() {
    this.codes = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ];
    this.self = this;
    this.getFiles = {
      //获取文件夹下的所有文件
      getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
      },
      //获取文件夹下的所有图片
      getImageFiles: function (path) {
        var imageList = [];
        this.getFileList(path).forEach((item) => {
          var ms = image(fs.readFileSync(item.path + item.filename));
          if (
            item.filename.indexOf('.jpeg') === -1 ||
            item.filename.indexOf('.jpg') === -1 ||
            item.filename.indexOf('.png') === -1
          ) {
            imageList.push(item.filename);
          }
          // if (ms.mimeType || ms.type == 'image') {
          //   imageList.push(item.filename);

          // }

          // ms.mimeType && (imageList.push(item.filename));
        });
        return imageList;
      }, //获取文件夹下所有非图片的文件 2018年8月18日 19:15:13更新
      getTxtList: function (path) {
        return this.getFileList(path).filter((item) => {
          var ms = image(fs.readFileSync(item.path + item.filename));

          return !ms.mimeType;
        });
      },
    };
  }

  // 日期格式化
  parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
      return null;
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else if (typeof time === 'string') {
        time = time
          .replace(new RegExp(/-/gm), '/')
          .replace('T', ' ')
          .replace(new RegExp(/\.[\d]{3}/gm), '');
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value;
      }
      return value || 0;
    });
    return time_str;
  }

  //创建6位验证码
  createSixValidCode() {
    let validCode = [];

    for (let i = 0; i < 6; i++) {
      let code = this.codes[Math.floor(Math.random() * this.codes.length)];
      validCode.push(code);
    }

    return validCode.join('');
  }

  //发送邮件
  sendEmail(options) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: CONFIG.EMAIL_OPTIONS.USER,
          to: options.emails,
          subject: options.subject,
          text: options.text,
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }

  //加密
  encryption(value) {
    return crypto
      .createHash('md5')
      .update(value + 'quchiqiusouhai')
      .digest('hex');
  }

  //创建token
  signToken(value) {
    return jsonwebtoken.sign(
      {
        data: value,
      },
      CONFIG.TOKEN_OPTIONS.SALT,
      {
        expiresIn: CONFIG.TOKEN_OPTIONS.EXPIRES,
      }
    );
  }

  //解析token
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, CONFIG.TOKEN_OPTIONS.SALT, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  //上传图片
  uploadImg(options) {
    return new Promise((resolve, reject) => {
      //将base64转二进制
      let fileData = Buffer.from(options.base64, 'base64');
      // console.log('fileData', fileData)
      //文件名
      let filename = uuid.v1() + '.' + options.type;
      // let filename = uuid.v1() + "." + options.type.split("/")[1];

      //写入文件夹里的图片名称
      let fileUrl = path.resolve(__basename, `upload/${filename}`);
      fs.writeFile(fileUrl, fileData, (err) => {
        //如果写入失败
        if (err) {
          reject(err);
        } else {
          resolve(filename);
          // resolve(CONFIG.UPLOAD_URL.URL + "/" + filename);
        }
      });
    });
  }
  //上传图片
  async uploadImg2(req, res) {
    return new Promise((resolve, reject) => {
      var form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          return res.end('Upload failed');
        }

        const oldPath = files.file[0].filepath;
        let newPath = path.resolve(
          __basename,
          `upload/${files.file[0].newFilename}.jpeg`
        );

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            return res.end('Rename failed');
          } else {
            res.end('Upload successful');
            resolve();
          }
        });
      });
      return;
      //写入文件夹里的图片名称
      let fileUrl = path.resolve(__basename, `upload/${filename}`);
      fs.writeFile(fileUrl, fileData, (err) => {
        //如果写入失败
        if (err) {
          reject(err);
        } else {
          resolve(filename);
          // resolve(CONFIG.UPLOAD_URL.URL + "/" + filename);
        }
      });
    });
  }
  async uploadImg3(req, res) {
    return new Promise((resolve, reject) => {
      let file = req.file;
      // file.originalname = Buffer.from(file.originalname, "base64");
      // console.log('file.originalname', file.originalname, file);
      let newFilename = uuid.v1() + '.' + file.mimetype.split('/')[1];
      let oldPath = path.resolve(__basename, `upload/${file.filename}`);
      let newPath = path.resolve(__basename, `upload/${newFilename}`);
      fs.rename(oldPath, newPath, (err) => {
        //如果写入失败
        if (err) {
          reject(err);
        } else {
          resolve(newFilename);
          // resolve(CONFIG.UPLOAD_URL.URL + "/" + filename);
        }
      });

      return;

      fs.writeFile(fileUrl, fileData, (err) => {
        //如果写入失败
        if (err) {
          reject(err);
        } else {
          resolve(filename);
          // resolve(CONFIG.UPLOAD_URL.URL + "/" + filename);
        }
      });
    });
  }

  //删除图片
  removeloadImg(options) {
    //判断是不是数组
    if (Array.isArray(options)) {
      options.forEach((v) => {
        //要删除的文件夹的图片名称
        let filename = v;
        let fileUrl = path.resolve(__basename, `upload/${filename}`);
        fs.unlink(fileUrl, (err) => {
          if (err) throw err;
          console.log('File deleted!');
        });
      });
    } else {
      //要删除的文件夹的图片名称
      let filename = options;
      // return
      let fileUrl = path.resolve(__basename, `upload/${filename}`);

      fs.unlink(fileUrl, (err) => {
        if (err) throw err;
        console.log('File deleted!');
      });
    }
  }

  //将svg图片代码转换成base64
  compileSvgToBase64(svgCode) {
    // 将SVG代码转换为UTF-8编码的字节数组
    const utf8Bytes = new TextEncoder().encode(svgCode);
    // 将字节数组编码为Base64
    const base64Svg =
      'data:image/svg+xml;base64,' +
      btoa(String.fromCharCode.apply(null, utf8Bytes));

    return base64Svg;
  }
  //svg格式的验证码图片
  svgVerificationCode() {
    const svgCaptcha = require('svg-captcha');
    const cap = svgCaptcha.createMathExpr({
      size: 4, // 个数
      width: 100, // 宽
      height: 30, // 高
      fontSize: 38, // 字体大小
      color: true, // 字体颜色是否多变
      noise: 2, // 干扰线几条
      // background: 'red', // 背景色
      charPreset: this.createSixValidCode(),
    });
    const captcha = svgCaptcha.create({
      size: 6, // 个数
      width: 100, // 宽
      height: 40, // 高
      fontSize: 38, // 字体大小
      color: true, // 字体颜色是否多变
      noise: 0, // 干扰线几条
      background: '#eee', // 背景色
      charPreset: this.createSixValidCode(),
    });
    return captcha;
  }

  //压缩图片
  compressPicture(options) {
    tinify.key = 'zFQMYzv8nq9YchXSR3G0QKY4BjXkWgk4';
    // tinify.proxy = "http://user:pass@127.0.0.1:9000";
    //fromUrl使用网络图片
    // var source = tinify.fromUrl("https://tinypng.com/images/panda-happy.png");
    let targetPath = path.join(
      __basename,
      `./upload/2fab0c40-4741-11ef-82fa-2b06b7ea7f3f.jpeg`
    );

    //fromFile使用本地图片
    var source = tinify.fromFile(targetPath);
    source.toFile(path.resolve(__basename, `upload/optimized2.png`));
    // fs.readFile("upload/optimized.png", function (err, sourceData) {
    //   if (err) throw err;
    //   tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
    //     if (err) throw err;
    //     // ...
    //   });
    // });
    // 上述两行代码也支持连写哦！
    // tinify.fromFile("unoptimized.jpg").toFile("optimized.jpg")
  }
  //获取文件夹下的所有图片
  getImageFilesName() {
    //获取文件夹下的所有图片
    let targetPath = path.join(__basename, `./upload/`);
    return this.getFiles.getImageFiles(targetPath);

    //获取文件夹下的所有文件
    // this.getFiles.getFileList("./public/");
  }
  //对比图片，数据库里没有的图片就删掉
  contrastDeleteImg(list, imgs) {
    let userImgList = [];
    let productImgList = [];
    let imgList = [];
    list.forEach((v) => {
      userImgList.push(v.userImg);
      productImgList.push(v.productImg);
    });
    let newUtils = new Utils();
    imgList = newUtils.duplicateRemoval(userImgList, productImgList);
    //删除图片
    newUtils.removeloadImg(newUtils.duplicateRemoval(imgList, imgs, 2));
  }
  //两个数组去重
  duplicateRemoval(arr1, arr2, type = 1) {
    if (type == 1) {
      let list = [];
      arr1.forEach((v) => {
        list.push(v);
      });
      arr2.forEach((v) => {
        list.push(v);
      });
      //Array.from(new Set(list))数组去重
      // let list2 = ['c1985640-4740-11ef-931e-450414bf58b2.jpeg', 'c1985640-4740-11ef-931e-450414bf58b2.jpeg']
      // console.log('list2[1]==list2[2]', list2[1] == list2[2])
      //list:[ 'c1985640-4740-11ef-931e-450414bf58b2.jpeg','c1985640-4740-11ef-931e-450414bf58b2.jpeg' ]
      list = Array.from(new Set(list));
      return list;
    } else {
      let list = [];
      //有重复的就放进列表
      function arrayDiff(arr1, arr2) {
        return arr1.filter((item) => !arr2.includes(item));
      }

      // 示例使用
      const array1 = [1, 2, 3, 4, 5];
      const array2 = [4, 5, 6, 7, 8];

      const diff = arrayDiff(array1, array2);
      list = Array.from(arr2).filter(
        (item) => !Array.from(arr1).includes(item)
      );
      return list;
    }
  }

  //获取选择月份的天数
  getMonthDay(time, type) {
    let year = new Date(time).getFullYear();
    //月份从0开始，默认+1
    let month = new Date(time).getMonth() + 1;

    let day = new Date(time).getDay() + 1;
    //选择月份的天数
    let monthDay = new Date(year, month, 0).getDate();

    let start = `${year}-${month}-01 00:00:00`;
    let end = `${year}-${month}-${monthDay} 23:59:59`;
    return (
      ' AND `t`.`created_at` >= ' +
      "'" +
      start +
      "'" +
      ' AND `t`.`created_at` <= ' +
      "'" +
      end +
      "'"
    );
  }
}

module.exports = new Utils();
