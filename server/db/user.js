//用户模型

const { Model, DataTypes } = require("sequelize");

class User extends Model { }

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: "表id",
    },

    userId: {
      type: DataTypes.STRING(36),
      unique: true,
      allowNull: false,
      defaultValue: "",
      comment: "用户id",
    },

    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      defaultValue: "",
      comment: "邮箱",
    },

    password: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "",
      comment: "密码",
    },

    userImg: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue:
        "http://127.0.0.1:9000/5be0f0f0-e1a3-11ec-a555-1f5c953a1f69.jpeg",
      comment: "用户头像",
    },

    phone: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: "",
      comment: "手机号",
    },

    nickName: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "",
      comment: "昵称",
    },

    userLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 2,
      comment: "用户等级：1管理员，2普通用户",
    },

    sex: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 2,
      comment: "性别:0男1女2未知",
    },
  },
  {
    sequelize,
    tableName: "user",
  }
);

User.sync({
  force: false,
});

module.exports = User;
