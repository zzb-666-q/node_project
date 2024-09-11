//商品类型和用户关系模型

const {Model, DataTypes} = require('sequelize');

class UserType extends Model {}

UserType.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '表id'
  },

  typeId: {
    type: DataTypes.STRING(36),
    unique: true,
    allowNull: false,
    defaultValue: '',
    comment: '商品类型id'
  },

  userId: {
    type: DataTypes.STRING(36),
    allowNull: false,
    defaultValue: '',
    comment: '用户id'
  }
}, {
  sequelize,
  tableName: 'user_type'
})


UserType.sync({
  force: false
})

module.exports = UserType;