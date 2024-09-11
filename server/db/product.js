//商品模型

const {Model, DataTypes} = require('sequelize');

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '表id'
  },

  productId: {
    type: DataTypes.STRING(36),
    unique: true,
    allowNull: false,
    defaultValue: '',
    comment: '商品id'
  },

  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
    unique: true,
    defaultValue: '',
    comment: '商品名称'
  },

  price: {
    type: DataTypes.DECIMAL(10, 2).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '商品价格'
  },

  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1,
    comment: '商品状态0上架1下架'
  },

  desc: {
    type: DataTypes.STRING(150),
    allowNull: true,
    defaultValue: null,
    comment: '商品描述'
  },

  smallImg: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: '',
    comment: '商品图片'
  },

  largeImg: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: '',
    comment: '详情图片'
  }
}, {
  sequelize,
  tableName: 'product'
})


Product.sync({
  force: false
})

module.exports = Product;