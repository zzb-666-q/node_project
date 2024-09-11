//商品类型模型

const {Model, DataTypes} = require('sequelize');

class Type extends Model {}

Type.init({
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

  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: '',
    comment: '商品类型'
  }
}, {
  sequelize,
  tableName: 'type'
})


Type.sync({
  force: false
})

module.exports = Type;