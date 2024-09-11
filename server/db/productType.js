//商品和商品类型关系模型

const {Model, DataTypes} = require('sequelize');

class ProductType extends Model {}

ProductType.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '表id'
  },

  typeId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    defaultValue: '',
    comment: '商品类型id'
  },

  productId: {
    type: DataTypes.STRING(36),
    unique: true,
    allowNull: false,
    defaultValue: '',
    comment: '商品id'
  }
}, {
  sequelize,
  tableName: 'product_type'
})


ProductType.sync({
  force: false
})

module.exports = ProductType;