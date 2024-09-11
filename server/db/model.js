//收集所有模型

const path = require('path');

let ValidCode = require(path.resolve(__basename, 'db/validCode.js'));
let User = require(path.resolve(__basename, 'db/user.js'));
let Type = require(path.resolve(__basename, 'db/type.js'));
let UserType = require(path.resolve(__basename, 'db/userType.js'));
let Product = require(path.resolve(__basename, 'db/product.js'));
let ProductType = require(path.resolve(__basename, 'db/productType.js'));
let UserProduct = require(path.resolve(__basename, 'db/userProduct.js'));


module.exports = {
  ValidCode,
  User,
  Type,
  UserType,
  Product,
  ProductType,
  UserProduct
}