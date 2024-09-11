//控制器层

const path = require('path');

let utils = require(path.resolve(__basename, 'utils/utils.js'));
const crypto = require('crypto');
const { QueryTypes, Op } = require('sequelize');
const uuid = require('uuid');
const { options } = require('svg-captcha');
// 处理图片文件中间件 升降序
function listDesc(type = 1, obj = `createdAt`) {
  if (type == 1) {
    return ' ORDER BY ' + obj + ' ASC LIMIT :offset, :limit'; //升序 根据时间从以前到现在
  } else {
    return ' ORDER BY ' + obj + ' DESC LIMIT :offset, :limit'; //降序 根据时间从现在到以前
  }
  // sql += " ORDER BY `created_at` DESC LIMIT :offset, :limit"; //降序 从大到小 sql +=
  // " ORDER BY `created_at` ASC LIMIT :offset, :limit"; //升序 从小到大
}

//获取数据库第几列的数据
function newReplacements(req, isUser) {
  if (isUser) {
    replacements = {
      userId: req.userId,
      offset: Number((req.query.offset - 1) * req.query.limit),
      limit: Number(req.query.limit),
    };
  } else {
    replacements = {
      offset: Number((req.query.offset - 1) * req.query.limit),
      limit: Number(req.query.limit),
    };
  }
  return replacements;
}

class Controller {
  constructor() {
    // this.replacements = {   offset: Number((req.query.offset - 1) *
    // req.query.limit),   limit: Number(req.query.limit), };
  }

  //发送验证码
  sendValidCode(req, res) {
    //     const svgCaptcha = require('svg-captcha'); const captcha =
    // svgCaptcha.create(); console.log(captcha); let validCode =
    // utils.createSixValidCode(); 验证码
    let captcha = utils.svgVerificationCode();
    let validCode = captcha.text;
    let validCodeId = uuid.v1();
    // console.log("validCode ==> ", validCode); console.log("req.body.email ==> ",
    // req.body.email);
    model.ValidCode.create({
      validCodeId,
      // email: req.body.email,
      validCode,
    })
      .then((result) => {
        // console.log(captcha);
        let ress = {
          validCode: result.validCode,
          validCodeId: result.validCodeId,
          img: utils.compileSvgToBase64(captcha.data),
        };
        res.send({ msg: '发送验证码成功', code: 200, result: ress });
      })
      .catch((err) => {
        console.log('er ==> ', err);
        res.send({ msg: '发送验证码失败', code: 500 });
      });
    //开发屏蔽发邮件
    return;
    utils
      .sendEmail({
        emails: req.body.email,
        subject: '邮箱验证码',
        text: `验证码为：${validCode}，5分钟有效`,
      })
      .then((result) => {
        console.log('result ==> ', result);
        res.send({ msg: '发送验证码成功', code: 200 });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '发送验证码失败', code: 500 });
      });
  }

  //注册接口
  async register(req, res) {
    //先判断当前邮箱是否被注册
    let user = await model.User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      let userId = uuid.v1();

      //加密密码
      let password = utils.encryption(req.body.password);

      //注册新用户
      model.User.create({
        userId,
        email: req.body.email,
        password,
        age: req.body.age,
      })
        .then((result) => {
          res.send({ msg: '注册成功', code: 200 });
        })
        .catch((err) => {
          console.log('err ==> ', err);
          res.send({ msg: '注册失败', code: 500 });
        });
    } else {
      res.send({ msg: '邮箱已注册', code: 300 });
    }
  }

  //登录
  login(req, res) {
    model.User.findOne({
      attributes: ['userId', 'password'],
      where: {
        email: req.body.email,
      },
    })
      .then((result) => {
        if (result) {
          let password = utils.encryption(req.body.password);
          if (password === result.dataValues.password) {
            //生成token
            let token = utils.signToken(result.dataValues.userId);

            return res.send({ msg: '登录成功', code: 200, token });
          } else {
            res.send({ msg: '邮箱或者密码错误', code: 500 });
          }
        } else {
          res.send({ msg: '邮箱未注册', code: 300 });
        }
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '登录失败', code: 500 });
      });
  }

  //退出登录
  loginOut(req, res) {
    res.send('loginOut,退出登录成功');
  }

  //获取用户列表总数量
  findUserListCount(req, res) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT COUNT(user_id) AS `count` FROM `user`';
      let count = 0;
      let replacements = {};
      // //判断是否根据商品类型关键字进行搜索 if (req.query.name) {   sql += " WHERE `nick_name` LIKE
      // :name";   replacements.name = `%${req.query.name}%`; } //判断是否根据创建日期关进行搜索 if
      // (req.query.createdAt) {   sql += " AND `created_at` >= :start AND
      // `created_at` <= :end";   replacements.start = `${req.query.createdAt}`;
      // replacements.end = `${req.query.createdAt.split(" ")[0]} 23:59:59`; }
      // 判断是否根据商品类型关键字进行搜索
      if (req.query.name) {
        sql += ' WHERE `nick_name` LIKE :name';
        replacements.name = `%${req.query.name}%`;
      } else {
        if (req.query.createdAt) {
          sql += ' WHERE  `created_at` >= :start AND `created_at` <= :end';
          replacements.start = `${req.query.createdAt} 00:00:00`;
          replacements.end = `${req.query.createdAt} 23:59:59`;
        }
      }

      //判断是否根据创建日期关进行搜索
      if (req.query.name && req.query.createdAt) {
        sql += ' AND  `created_at` >= :start AND `created_at` <= :end';
        replacements.start = `${req.query.createdAt} 00:00:00`;
        replacements.end = `${req.query.createdAt} 23:59:59`;
      }

      sequelize
        .query(sql, { replacements, type: QueryTypes.SELECT })
        .then((result) => {
          count = result[0].count;
          resolve(count);
        })
        .catch((err) => {
          reject('失败');
        });
    });
  }

  //获取用户列表
  async findUserList(req, res) {
    //  let sql= "SELECT `us`.`user_id` AS `userId`,`us`.`email`,`us`.`created_at`
    // AS `createdAt` ,`us`.`nick_name` AS `nickName`, `us`.`phone` FROM `user` AS
    // `us` WHERE email = '123@qq.com' AND nick_name LIKE '%晓东%' AND
    // `us`.`created_at` >= '2022-06-01 00:00:00' AND `us`.`created_at` <=
    // '2022-06-01 23:59:59' ORDER BY `us`.`created_at` DESC LIMIT 0, 10";
    let sql =
      'SELECT `us`.user_id AS `userId`,`us`.email,`us`.created_at AS `createdAt` ,`us`.' +
      'nick_name AS `nickName`, `us`.phone FROM `user` AS `us`';
    let newController = new Controller();
    //获取用户列表总数量
    var count = await newController.findUserListCount(req, res);
    let replacements = newReplacements(req);

    //判断是否根据商品类型关键字进行搜索
    if (req.query.name) {
      sql += ' WHERE `nick_name` LIKE :name';
      replacements.name = `%${req.query.name}%`;
    } else {
      if (req.query.createdAt) {
        sql +=
          ' WHERE  `us`.`created_at` >= :start AND  `us`.`created_at` <= :end';
        replacements.start = `${req.query.createdAt} 00:00:00`;
        replacements.end = `${req.query.createdAt} 23:59:59`;
      }
    }

    //判断是否根据创建日期关进行搜索
    if (req.query.name && req.query.createdAt) {
      sql += ' AND  `us`.`created_at` >= :start AND  `us`.`created_at` <= :end';
      replacements.start = `${req.query.createdAt} 00:00:00`;
      replacements.end = `${req.query.createdAt} 23:59:59`;
    }

    // sql += " ORDER BY `created_at` DESC LIMIT :offset, :limit"; //降序
    sql += ' ORDER BY `created_at` ASC LIMIT :offset, :limit'; //升序 从小到大

    sequelize
      .query(sql, { replacements, type: QueryTypes.SELECT })
      .then((result) => {
        result.forEach((v) => {
          v.createdAt = utils.parseTime(
            new Date(v.createdAt),
            '{y}-{m}-{d} {h}:{i}:{s}'
          );
        });
        res.send({ msg: '查询用户列表成功', code: 200, result, count: count });
      })
      .catch((err) => {
        res.send({ msg: '查询用户失败', code: 500 });
      });
  }

  //创建商品类型
  async createType(req, res) {
    //先判断当前商品类型是否存在
    let type = await model.Type.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (!type) {
      let typeId = uuid.v1();
      //启动事务处理
      sequelize
        .transaction(async (t) => {
          //1、创建商品类型

          await model.Type.create(
            {
              name: req.body.name,
              typeId,
            },
            { transaction: t }
          );

          //2、创建用户和商品类型的关系
          await model.UserType.create(
            {
              typeId,
              userId: req.userId,
            },
            { transaction: t }
          );
        })
        .then(() => {
          res.send({ msg: '创建成功', code: 200 });
        })
        .catch((err) => {
          res.send({ msg: '创建失败', code: 500 });
        });
    } else {
      res.send({ msg: '该商品类型已存在', code: 300 });
    }
  }

  //查询商品类型列表
  async findTypeList(req, res) {
    let newController = new Controller();
    var count = await newController.getTypeCount(req, res);
    let sql =
      'SELECT `ut`.`type_id` AS `typeId`, `ut`.`user_id` AS `userId`, `t`.`name`, `t`.`' +
      'created_at` AS `createdAt` FROM `user_type` AS `ut` INNER JOIN `type` AS `t` ON ' +
      '`t`.`type_id` = `ut`.`type_id` AND `ut`.`user_id` = :userId';

    //替换sql语句的参数
    let replacements = newReplacements(req, 1);

    //判断是否根据商品类型关键字进行搜索
    if (req.query.name) {
      sql += ' AND `t`.`name` LIKE :name';
      replacements.name = `%${req.query.name}%`;
    }

    //判断是否根据创建日期关进行搜索
    if (req.query.createdAt) {
      sql += utils.getMonthDay(req.query.createdAt);
      // sql += " AND `t`.`created_at` >= :start AND `t`.`created_at` <= :end";
      // replacements.start = `${utils.getMonthDay(req.query.createdAt,"start")}`;
      // replacements.end = `${utils.getMonthDay(req.query.createdAt,"end")}`;
      // replacements.start = `${req.query.createdAt}`; replacements.end =
      // `${req.query.createdAt.split(" ")[0]} 23:59:59`;
    }

    sql += listDesc();

    sequelize
      .query(sql, { replacements, type: QueryTypes.SELECT })
      .then((result) => {
        result.forEach((v) => {
          v.createdAt = utils.parseTime(
            new Date(v.createdAt),
            '{y}-{m}-{d} {h}:{i}:{s}'
          );
        });
        res.send({ msg: '查询商品类型成功', code: 200, result, count });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '查询商品类型失败', code: 500 });
      });
  }

  //查询商品类型总数量
  getTypeCount(req, res) {
    return new Promise((resolve, reject) => {
      let sql =
        'SELECT COUNT(`t`.`type_id`) AS `count` FROM `user_type` AS `ut` INNER JOIN `type' +
        '` AS `t` ON `t`.`type_id` = `ut`.`type_id` AND `ut`.`user_id` = :userId';

      //替换sql语句的参数
      let replacements = {
        userId: req.userId,
      };

      //判断是否根据商品类型关键字进行搜索
      if (req.query.name) {
        sql += ' AND `t`.`name` LIKE :name';
        replacements.name = `%${req.query.name}%`;
      }

      //判断是否根据创建日期关进行搜索
      if (req.query.createdAt) {
        sql += ' AND `t`.`created_at` >= :start AND `t`.`created_at` <= :end';
        replacements.start = `${req.query.createdAt}`;
        replacements.end = `${req.query.createdAt.split(' ')[0]} 23:59:59`;
      }

      sequelize
        .query(sql, { replacements, type: QueryTypes.SELECT })
        .then((result) => {
          resolve(result[0].count);
        })
        .catch((err) => {
          reject('查询商品类型总数量失败');
        });
    });
  }

  //根据商品类型typeId查询商品类型数据
  getTypeByTypeId(req, res) {
    let sql =
      'SELECT `ut`.`type_id` AS `typeId`, `ut`.`user_id` AS `userId`, `t`.`name` FROM `' +
      'user_type` AS `ut` INNER JOIN `type` AS `t` ON `t`.`type_id` = `ut`.`type_id` AN' +
      'D `ut`.`user_id` = :userId AND `t`.`type_id` = :typeId';
    sequelize
      .query(sql, {
        replacements: {
          userId: req.userId,
          typeId: req.query.typeId,
        },
        type: QueryTypes.SELECT,
      })
      .then((result) => {
        res.send({ msg: '查询商品类型成功', code: 200, result });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '查询商品类型失败', code: 500 });
      });
  }

  //编辑商品类型
  editType(req, res) {
    model.Type.update(
      {
        name: req.body.name,
      },
      {
        where: {
          typeId: req.body.typeId,
        },
      }
    )
      .then((result) => {
        res.send({ msg: '编辑商品类型成功', code: 200 });
      })
      .catch((err) => {
        res.send({ msg: '编辑商品类型失败', code: 500 });
      });
  }

  //删除商品类型
  removeType(req, res) {
    sequelize
      .transaction(async (t) => {
        //1、删除商品类型基础表数据
        model.Type.destroy({
          where: {
            typeId: {
              [Op.in]: req.body.typeIds,
            },
          },
        });

        //2、删除商品类型和用户关系表数据
        model.UserType.destroy({
          where: {
            typeId: {
              [Op.in]: req.body.typeIds,
            },
          },
        });
      })
      .then(() => {
        res.send({ msg: '删除商品类型成功', code: 200 });
      })
      .catch((err) => {
        res.send({ msg: '删除商品类型失败', code: 500 });
      });
  }

  //获取商品类型
  getType(req, res) {
    let sql =
      'SELECT `ut`.`type_id` AS `typeId`, `ut`.`user_id` AS `userId`, `t`.`name`, `t`.`' +
      'created_at` AS `createdAt` FROM `user_type` AS `ut` INNER JOIN `type` AS `t` ON ' +
      '`t`.`type_id` = `ut`.`type_id` AND `ut`.`user_id` = :userId';
    sequelize
      .query(sql, {
        replacements: {
          userId: req.userId,
        },
        type: QueryTypes.SELECT,
      })
      .then((result) => {
        res.send({ msg: '查询商品类型成功', code: 200, result });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '查询商品类型查询失败', code: 500 });
      });
  }

  //发布商品
  async postProduct(req, res) {
    // 上传商品图片 let smallImg = await utils.uploadImg({   base64: req.body.smallImg,
    // type: req.body.smallImgType, }); //上传详情图片 let largeImg = await
    // utils.uploadImg({   base64: req.body.largeImg,   type: req.body.largeImgType,
    // }); 生成商品id
    let productId = uuid.v1();

    //启动事务处理
    sequelize
      .transaction(async (t) => {
        //1: 创建商品数据
        await model.Product.create(
          {
            productId,
            name: req.body.name,
            price: Number(req.body.price),
            status: Number(req.body.status),
            desc: req.body.desc,
            smallImg: req.body.smallImg,
            // largeImg,
          },
          { transaction: t }
        );

        //2: 创建商品和商品类型关系数据
        await model.ProductType.create(
          {
            productId,
            typeId: req.body.type,
          },
          { transaction: t }
        );

        //3: 创建商品和用户的关系数据
        await model.UserProduct.create(
          {
            productId,
            userId: req.userId,
          },
          { transaction: t }
        );
      })
      .then(() => {
        res.send({ msg: '发布商品成功', code: 200 });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '发布商品失败', code: 500 });
      });
  }
  //图片上传并返回
  async uploadImages(req, res) {
    //上传商品图片
    let fileName = await utils.uploadImg3(req, res);
    let result = {
      fileName: fileName,
    };
    res.send({ msg: '图片上传成功', code: 200, result });
  }
  //查询商品列表
  async getProductList(req, res) {
    // let sql = "SELECT `p`.`product_id`, `p`.`name` AS `product_name`,
    // `p`.`price`, `p`.`status`, `p`.`desc`, `p`.`small_img`, `p`.`large_img`,
    // `p`.`created_at`, `pt`.`type_id`, `t`.`name` FROM `product` AS `p` INNER JOIN
    // `product_type` AS `pt` ON `pt`.`product_id` = `p`.`product_id` INNER JOIN
    // `type` AS `t` ON `t`.`type_id` = `pt`.`type_id` INNER JOIN `user_product` AS
    // `up` ON `up`.`product_id` = `p`.`product_id` AND `up`.`user_id` =
    // 'ce4b2840-d19f-11ec-903b-e90dbac59cca' AND `p`.`name` LIKE '%菜%' AND
    // `t`.`type_id` = '11606bf0-d357-11ec-921f-e1246f807204' AND `p`.`status` = 0
    // AND `p`.`created_at` >= '2022-05-16 00:00:00' AND `p`.`created_at` <=
    // '2022-05-16 23:59:59' ORDER BY `p`.`created_at` DESC LIMIT 1, 1";
    let sql =
      'SELECT `p`.`product_id` AS `productId` , `p`.`name` AS `productName`, `p`.`price' +
      '`, `p`.`status`, `p`.`desc`, `p`.`small_img` AS `smallImg`, `p`.`large_img`, `p`' +
      '.`created_at` AS `createdAt`, `pt`.`type_id`, `t`.`name` FROM `product` AS `p` I' +
      'NNER JOIN `product_type` AS `pt` ON `pt`.`product_id` = `p`.`product_id` INNER J' +
      'OIN `type` AS `t` ON `t`.`type_id` = `pt`.`type_id` INNER JOIN `user_product` AS' +
      ' `up` ON `up`.`product_id` = `p`.`product_id` AND `up`.`user_id` = :userId';

    let replacements = newReplacements(req, 1);

    let newController = new Controller();
    //获取所有用户创建的商品类型总数量 var count = 2;
    var total = await newController.getProductCount(req);
    // //处理参数
    if (req.query.name && req.query.name !== '') {
      replacements.name = `%${req.query.name}%`;
      sql += ' AND `p`.`name` LIKE :name';
    }

    if (req.query.typeId && req.query.typeId !== '') {
      replacements.typeId = req.query.typeId;
      sql += ' AND `t`.`type_id` = :typeId';
    }

    if (req.query.status && req.query.status !== '') {
      replacements.status = Number(req.query.status);
      sql += ' AND `p`.`status` = :status';
    }

    if (req.query.createdAt && req.query.createdAt !== '') {
      replacements.start = req.query.createdAt + ' 00:00:00';
      replacements.end = req.query.createdAt + ' 23:59:59';
      sql += ' AND `p`.`created_at` >= :start AND `p`.`created_at` <= :end';
    }

    sql += listDesc();

    sequelize
      .query(sql, { replacements, type: QueryTypes.SELECT })
      .then((result) => {
        //格式化时间
        result.forEach((v) => {
          v.createdAt = utils.parseTime(
            new Date(v.createdAt),
            '{y}-{m}-{d} {h}:{i}:{s}'
          );
        });
        res.send({ msg: '查询商品类型成功', code: 200, result, total });
      })
      .catch((err) => {
        res.send({ msg: '查询商品类型失败', code: 500 });
      });
  }

  //获取商品总数量
  getProductCount(req, res) {
    return new Promise((resolve, reject) => {
      let sql =
        'SELECT COUNT(`p`.`product_id`) AS `count` FROM `product` AS `p` INNER JOIN `prod' +
        'uct_type` AS `pt` ON `pt`.`product_id` = `p`.`product_id` INNER JOIN `type` AS `' +
        't` ON `t`.`type_id` = `pt`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`' +
        'product_id` = `p`.`product_id` AND `up`.`user_id` = :userId';

      //替换sql语句的参数
      let replacements = {
        userId: req.userId,
      };

      //处理参数
      if (req.query.name) {
        replacements.name = `%${req.query.name}%`;
        sql += ' AND `p`.`name` LIKE :name';
      }

      if (req.query.typeId) {
        replacements.typeId = req.query.typeId;
        sql += ' AND `t`.`type_id` = :typeId';
      }

      if (req.query.status) {
        replacements.status = Number(req.query.status);
        sql += ' AND `p`.`status` = :status';
      }

      if (req.query.createdAt) {
        replacements.start = req.query.createdAt + ' 00:00:00';
        replacements.end = req.query.createdAt + ' 23:59:59';
        sql += ' AND `p`.`created_at` >= :start AND `p`.`created_at` <= :end';
      }

      sequelize
        .query(sql, { replacements, type: QueryTypes.SELECT })
        .then((result) => {
          resolve(result[0].count);
        })
        .catch((err) => {
          reject('获取商品总数量失败');
        });
    });
  }

  //修改商品上下架状态
  updateProductStatus(req, res) {
    model.Product.update(
      {
        status: Number(req.body.status),
      },
      {
        where: {
          productId: {
            [Op.in]: req.body.productId,
          },
        },
      }
    )
      .then((result) => {
        res.send({ msg: '修改商品上下架状态成功', code: 200 });
      })
      .catch((err) => {
        res.send({ msg: '修改商品上下架状态失败', code: 500 });
      });
  }

  //删除商品
  async removeProduct(req, res) {
    //1、删除商品基础表数据 2、删除商品和类型关系表数据 3、删除商品和用户表数据
    // utils.removeloadImg(imgName);//imgName是图片名称 return
    let newController = new Controller();
    //获取要删除的商品图片
    var imglist = await newController.getProductImgById(req, res);
    // console.log(`output->imglist`, imglist)
    // return
    sequelize
      .transaction(async (t) => {
        //1、删除商品基础表数据
        await model.Product.destroy(
          {
            where: {
              productId: {
                [Op.in]: req.body.productIds,
              },
            },
          },
          { transaction: t }
        );

        //2、删除商品和类型关系表数据
        await model.ProductType.destroy(
          {
            where: {
              productId: {
                [Op.in]: req.body.productIds,
              },
            },
          },
          { transaction: t }
        );

        //3、删除商品和用户表数据
        await model.UserProduct.destroy(
          {
            where: {
              productId: {
                [Op.in]: req.body.productIds,
              },
            },
          },
          { transaction: t }
        );
      })
      .then(() => {
        utils.removeloadImg(imglist);
        res.send({ msg: '删除商品成功', code: 200 });
      })
      .catch(() => {
        res.send({ msg: '删除商品失败', code: 500 });
      });
  }

  //根据商品id查询商品图片
  getProductImgById(req, res) {
    // let sql =
    //   'SELECT `p`.small_img FROM `product` AS `p` WHERE `p`.product_id = :productId'
    // let sql2 =
    //   "SELECT `p`.small_img FROM `product` AS `p` WHERE `p`.product_id IN ('c462ba80-49a9-11ef-9030-ab301d4f7347', '258a7180-49ab-11ef-b1e1-c97be22f8d00')"
    return new Promise((resolve, reject) => {
      model.Product.findAll({
        attributes: ['small_img'],
        where: {
          productId: {
            [Op.in]: req.body.productIds,
          },
        },
      })
        .then((result) => {
          res.send({ msg: '查询商品成功', code: 200, result });
          resolve(result);
        })
        .catch((err) => {
          res.send({ msg: '查询商品失败', code: 500 });
        });
    });
  }

  //根据商品id查询商品数据
  async getProductById(req, res) {
    // let newController = new Controller()
    // //获取用户列表总数量
    // var imglist = await newController.getProductImgById(req, res)
    // console.log(`output->imglist`, imglist)
    // return
    let sql =
      'SELECT `p`.`product_id` AS `productId`, `p`.`name`, `p`.`price`, `p`.`status`, `' +
      'p`.`desc`, `p`.`small_img` AS `smallImg`, `p`.`large_img` AS `largeImg`, `t`.`ty' +
      'pe_id` AS `type` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `pt`' +
      '.`product_id` = `p`.`product_id` INNER JOIN `type` AS `t` ON `t`.`type_id` = `pt' +
      '`.`type_id` AND `p`.`product_id` = :productId';
    sequelize
      .query(sql, {
        replacements: {
          productId: req.query.productId,
        },
        type: QueryTypes.SELECT,
      })
      .then((result) => {
        res.send({ msg: '查询商品成功', code: 200, result });
      })
      .catch((err) => {
        res.send({ msg: '查询商品失败', code: 500 });
      });
  }

  //编辑商品
  async editProduct(req, res) {
    // return res.send('ok');
    const Op = sequelize.Op;
    //保存商品基础数据表的数据
    let productData = {
      ...req.body,
    };

    delete productData.productId;

    //判断是否存在图片修改 商品图片
    if (req.body.smallImg) {
      productData.smallImg = await utils.uploadImg({
        base64: req.body.smallImg,
        type: req.body.smallImgType,
      });

      delete productData.smallImgType;
    }

    //详情图片
    if (req.body.largeImg) {
      productData.largeImg = await utils.uploadImg({
        base64: req.body.largeImg,
        type: req.body.largeImgType,
      });

      delete productData.largeImgType;
    }

    //启动事务处理
    sequelize
      .transaction(async (t) => {
        //是否存在修改商品类型
        if (req.body.type) {
          //修改商品和商品类型关系表数据
          await model.ProductType.update(
            {
              typeId: req.body.type,
            },
            {
              where: {
                productId: req.body.productId,
              },
            },
            { transaction: t }
          );

          delete productData.type;
        }

        //是否存在修改商品基础表数据

        if (Object.keys(productData).length > 0) {
          //修改商品数据
          await model.Product.update(
            {
              ...productData,
            },
            {
              where: {
                productId: req.body.productId,
              },
            },
            { transaction: t }
          );
        }
      })
      .then(() => {
        res.send({ msg: '编辑商品成功', code: 200 });
      })
      .catch((err) => {
        res.send({ msg: '编辑商品失败', code: 500 });
      });
  }

  //选择多个商品上下架
  updateProductListStatus(req, res) {
    model.Product.update(
      {
        status: Number(req.body.status),
      },
      {
        where: {
          productId: {
            [Op.in]: req.body.productId,
          },
        },
      }
    )
      .then((result) => {
        res.send({ msg: '修改商品上下架状态成功', code: 200, result });
      })
      .catch((err) => {
        res.send({ msg: '修改商品上下架状态成功', code: 500 });
      });
  }

  //获取用户信息
  getUserInfo(req, res) {
    model.User.findOne({
      attributes: ['email', 'password', 'userImg'],
      where: {
        userId: req.userId,
      },
    })
      .then((result) => {
        res.send({ msg: '获取用户数据成功', code: 200, result });
      })
      .catch((err) => {
        res.send({ msg: '获取用户数据失败', code: 500 });
      });
  }

  //获取所有用户创建的商品类型
  async getAlluserTypeList(req, res) {
    let sql =
      'SELECT `ut`.`type_id` AS `typeId`, `ut`.`user_id` AS `userId`,`t`.`name` AS `typ' +
      'eName`,`u`.email , `u`.nick_name AS `nickName`,`ut`.`created_at` AS `createdAt` ' +
      'FROM `user_type` AS `ut` INNER JOIN `type` AS `t` INNER JOIN `user` AS `u` ON `t' +
      '`.`type_id` = `ut`.`type_id` AND `u`.user_id = `ut`.user_id';
    //替换sql语句的参数
    let replacements = newReplacements(req);

    let newController = new Controller();
    //获取所有用户创建的商品类型总数量
    var count = await newController.getAlluserTypeCount(req, res);
    // var count = 20; 判断是否根据创建人关键字进行搜索
    if (req.query.nickName) {
      sql += ' AND `u`.nick_name LIKE :nickName';
      replacements.nickName = `%${req.query.nickName}%`;
    }
    //判断是否根据商品类型关键字进行搜索
    if (req.query.typeName) {
      sql += ' AND `t`.`name` LIKE :typeName';
      replacements.typeName = `%${req.query.typeName}%`;
    }

    //判断是否根据创建日期关进行搜索
    if (req.query.createdAt) {
      sql += ' AND `t`.`created_at` >= :start AND `t`.`created_at` <= :end';
      replacements.start = `${req.query.createdAt}`;
      replacements.end = `${req.query.createdAt.split(' ')[0]} 23:59:59`;
    }
    sql += listDesc();
    sequelize
      .query(sql, { replacements, type: QueryTypes.SELECT })
      .then((result) => {
        result.forEach((v) => {
          v.createdAt = utils.parseTime(
            new Date(v.createdAt),
            '{y}-{m}-{d} {h}:{i}:{s}'
          );
        });
        res.send({ msg: '查询商品类型成功', code: 200, result, count });
      })
      .catch((err) => {
        res.send({ msg: '查询商品类型失败', code: 500 });
      });
  }
  //获取所有用户创建的商品类型的数量
  getAlluserTypeCount(req, res) {
    return new Promise((resolve, reject) => {
      let sql =
        'SELECT COUNT(`ut`.`type_id`) AS `count` FROM `user_type` AS `ut` INNER JOIN `typ' +
        'e` AS `t` INNER JOIN `user` AS `u` ON `t`.`type_id` = `ut`.`type_id` AND `u`.use' +
        'r_id = `ut`.user_id';

      // //替换sql语句的参数 let replacements = {   userId: req.userId, }; 判断是否根据创建人关键字进行搜索
      if (req.query.nickName) {
        sql += ' AND `u`.nick_name LIKE :nickName';
        replacements.nickName = `%${req.query.nickName}%`;
      }
      //判断是否根据商品类型关键字进行搜索
      if (req.query.typeName) {
        sql += ' AND `t`.`name` LIKE :typeName';
        replacements.typeName = `%${req.query.typeName}%`;
      }

      //判断是否根据创建日期关进行搜索
      if (req.query.createdAt) {
        sql += ' AND `t`.`created_at` >= :start AND `t`.`created_at` <= :end';
        replacements.start = `${req.query.createdAt}`;
        replacements.end = `${req.query.createdAt.split(' ')[0]} 23:59:59`;
      }

      sequelize
        .query(sql, { replacements, type: QueryTypes.SELECT })
        .then((result) => {
          resolve(result[0].count);
          // resolve(result);
        })
        .catch((err) => {
          reject('失败');
        });
    });
  }

  //查询所有用户的商品列表
  async getAlluserProductList(req, res) {
    let sql =
      'SELECT  `p`.`product_id` AS `productId` , `p`.`name` AS `productName`, `p`.`pric' +
      'e`, `p`.`status`, `p`.`desc`, `p`.`small_img` AS `smallImg`, `p`.`large_img`, `p' +
      '`.`created_at` AS `createdAt`, `pt`.`type_id`, `t`.`name`,`u`.`email` , `u`.nick' +
      '_name AS `nickName` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `' +
      'pt`.`product_id` = `p`.`product_id` INNER JOIN `type` AS `t` ON `t`.`type_id` = ' +
      '`pt`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`product_id` = `p`.`pro' +
      'duct_id`  INNER JOIN `user_type` AS `ut`  INNER JOIN `user` AS `u` ON `t`.`type_' +
      'id` = `ut`.`type_id` AND `u`.user_id = `ut`.user_id ';

    let replacements = newReplacements(req);
    let newController = new Controller();
    var count = await newController.getAlluserProductListCount(req, res);
    // //处理参数
    if (req.query.name && req.query.name !== '') {
      replacements.name = `%${req.query.name}%`;
      sql += ' AND `p`.`name` LIKE :name';
    }

    if (req.query.typeId && req.query.typeId !== '') {
      replacements.typeId = req.query.typeId;
      sql += ' AND `t`.`type_id` = :typeId';
    }

    if (req.query.status && req.query.status !== '') {
      replacements.status = Number(req.query.status);
      sql += ' AND `p`.`status` = :status';
    }

    if (req.query.createdAt && req.query.createdAt !== '') {
      replacements.start = req.query.createdAt + ' 00:00:00';
      replacements.end = req.query.createdAt + ' 23:59:59';
      sql += ' AND `p`.`created_at` >= :start AND `p`.`created_at` <= :end';
    }

    sql += listDesc();

    sequelize
      .query(sql, { replacements, type: QueryTypes.SELECT })
      .then((result) => {
        result.forEach((v) => {
          v.createdAt = utils.parseTime(
            new Date(v.createdAt),
            '{y}-{m}-{d} {h}:{i}:{s}'
          );
        });
        res.send({ msg: '查询商品类型成功', code: 200, result, count });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '查询商品类型失败', code: 500 });
      });
  }

  //获取商品总数量
  getAlluserProductListCount(req, res) {
    return new Promise((resolve, reject) => {
      let sql =
        'SELECT COUNT( `p`.`product_id`) AS `count` FROM `product` AS `p` INNER JOIN `pro' +
        'duct_type` AS `pt` ON `pt`.`product_id` = `p`.`product_id` INNER JOIN `type` AS ' +
        '`t` ON `t`.`type_id` = `pt`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.' +
        '`product_id` = `p`.`product_id`  INNER JOIN `user_type` AS `ut`  INNER JOIN `use' +
        'r` AS `u` ON `t`.`type_id` = `ut`.`type_id` AND `u`.user_id = `ut`.user_id ';

      // //处理参数
      if (req.query.name && req.query.name !== '') {
        replacements.name = `%${req.query.name}%`;
        sql += ' AND `p`.`name` LIKE :name';
      }

      if (req.query.typeId && req.query.typeId !== '') {
        replacements.typeId = req.query.typeId;
        sql += ' AND `t`.`type_id` = :typeId';
      }

      if (req.query.status && req.query.status !== '') {
        replacements.status = Number(req.query.status);
        sql += ' AND `p`.`status` = :status';
      }

      if (req.query.createdAt && req.query.createdAt !== '') {
        replacements.start = req.query.createdAt + ' 00:00:00';
        replacements.end = req.query.createdAt + ' 23:59:59';
        sql += ' AND `p`.`created_at` >= :start AND `p`.`created_at` <= :end';
      }

      sequelize
        .query(sql, { replacements, type: QueryTypes.SELECT })
        .then((result) => {
          resolve(result[0].count);
          // resolve(result);
        })
        .catch((err) => {
          reject('失败');
        });
    });
  }
  //获取所有图片
  getImageName(req, res) {
    let sql =
      'SELECT `user`.`user_img` AS `userImg`,`product`.`small_img` AS `productImg`  FRO' +
      'M `user` , `product`';
    // let sql = "SELECT `user`.`user_img` AS `userImg`  FROM `user`;SELECT
    // `product`.`small_img` AS `productImg`  FROM  `product`"; 替换sql语句的参数 let
    // replacements = {   userId: req.userId, };
    sequelize
      .query(sql, { type: QueryTypes.SELECT })
      .then((result) => {
        //获取node文件下所有图片
        let imageList = utils.getImageFilesName();
        //删掉多余图片
        utils.contrastDeleteImg(result, imageList);
        res.send({ msg: '删除图片成功', code: 200 });
      })
      .catch((err) => {
        console.log('err', err);
        res.send({ msg: '获取所有图片失败', code: 500 });
      });
  }

  /**
   * app小程序的接口
   */
  //根据商品类型查询商品数据
  getAppProductBytypeId(req, res) {
    let sql =
      'SELECT `p`.`product_id` AS `productId`,`p`.`name`,`p`.`price`,`p`.`status`,`p`.`desc`,`p`.`small_img` AS `smallImg`, `p`.`large_img` AS `largeImg` ,`pt`.`type_id` AS `typeId` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`product_id` = `pt`.`product_id` AND `pt`.`type_id` = :typeId';
    sequelize
      .query(sql, {
        replacements: {
          typeId: req.query.typeId,
        },
        type: QueryTypes.SELECT,
      })
      .then((result) => {
        res.send({ msg: '查询商品类型成功', code: 200, result });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '查询商品类型查询失败', code: 500 });
      });
  }

  //获取商品类型
  getAppType(req, res) {
    let sql = 'SELECT `type_id` AS `typeId`, `name` FROM `type`';
    sequelize
      .query(sql, {
        // replacements: {
        //   userId: "e8c12790-e187-11ec-ab56-f5195d64b1a6",
        // },
        type: QueryTypes.SELECT,
      })
      .then((result) => {
        res.send({ msg: '查询商品类型成功', code: 200, result });
      })
      .catch((err) => {
        console.log('err ==> ', err);
        res.send({ msg: '查询商品类型查询失败', code: 500 });
      });
  }
}

module.exports = new Controller();
