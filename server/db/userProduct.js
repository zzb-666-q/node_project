//用户和商品关系模型

const {Model, DataTypes} = require('sequelize');

class UserProduct extends Model {}

UserProduct.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '表id'
  },

  userId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    defaultValue: '',
    comment: '用户id'
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
  tableName: 'user_product'
})


UserProduct.sync({
  force: false
})

module.exports = UserProduct;