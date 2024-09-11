//连接mysql
//创建sequelize连接mysql实例

const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(CONFIG.MYSQL_OPTIONS.DATABASE, CONFIG.MYSQL_OPTIONS.USER, CONFIG.MYSQL_OPTIONS.PASSWORD, {
  host: CONFIG.MYSQL_OPTIONS.HOST,
  dialect: CONFIG.MYSQL_OPTIONS.DIALECT,
  define: {
    underscored: CONFIG.MYSQL_OPTIONS.DIALECT
  },
  timezone: CONFIG.MYSQL_OPTIONS.TIMEZONE,
});

module.exports = sequelize;