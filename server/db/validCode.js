//验证码模型

const {Model, DataTypes} = require('sequelize');

class ValidCode extends Model {}

ValidCode.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: '表id'
  },

  validCodeId: {
    type: DataTypes.STRING(36),
    unique: true,
    allowNull: false,
    defaultValue: '',
    comment: '验证码id'
  },

  email: {
    type: DataTypes.STRING(40),
    allowNull: false,
    defaultValue: '',
    comment: '邮箱'
  },

  validCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    defaultValue: '',
    comment: '验证码'
  }
}, {
  sequelize,
  tableName: 'valid_code'
})


ValidCode.sync({
  force: false
})

module.exports = ValidCode;