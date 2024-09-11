// 路由层

const path = require("path");

let controller = require(path.resolve(__basename, "controller/controller.js"));
//文件上传处理
const multer = require("multer");
var upload = multer({ dest: 'upload/' })

module.exports = (app) => {

  //发送验证码
  app.post("/sendValidCode", controller.sendValidCode);

  //添加到数据库
  // app.post('/adduser', controller.addUser);

  //注册
  app.post("/register", controller.register);

  //登录
  app.post("/login", controller.login);

  //退出登录
  app.get("/loginOut", controller.loginOut);

  //查询用户列表
  app.get("/findUserList", controller.findUserList);

  //创建商品类型
  app.post("/createType", controller.createType);

  //查询商品类型
  app.get("/typeList", controller.findTypeList);

  // //查询商品类型总数据量
  // app.get("/typeCount", controller.getAllTypeCount);

  //删除商品类型
  app.post("/removeType", controller.removeType);

  //获取商品类型
  app.get("/type", controller.getType);

  //发布商品信息
  app.post("/postProduct", controller.postProduct);

  //图片上传
  app.post("/uploadImages", upload.single('file'), controller.uploadImages);
  // app.post("/uploadImages", controller.uploadImages);


  //查询商品
  app.get("/productList", controller.getProductList);

  //获取商品总数量
  // app.get("/productCount", controller.getProductCount);

  //修改商品上下架状态
  app.post("/updateProductStatus", controller.updateProductStatus);

  //删除商品
  app.post("/removeProduct", controller.removeProduct);

  //根据商品id查询商品数据
  app.get("/product", controller.getProductById);

  //编辑商品
  app.post("/editProduct", controller.editProduct);

  //获取用户信息
  app.get("/userInfo", controller.getUserInfo);

  //获取所有用户创建的商品类型 
  app.get("/getAlluserTypeList", controller.getAlluserTypeList);

  //获取所有用户创建的商品
  app.get("/getAlluserProductList", controller.getAlluserProductList);

  //获取所有图片,数据库里没有的就删掉
  app.get("/getImageName", controller.getImageName);

   /**
   * app小程序的接口
   */
  //获取商品类型
  app.get("/getAppType", controller.getAppType);

  //获取商品
  app.get("/getAppProduct", controller.getAppProductBytypeId);
};
