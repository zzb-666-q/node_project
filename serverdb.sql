/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : serverdb

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2024-08-28 23:08:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `app_user`
-- ----------------------------
DROP TABLE IF EXISTS `app_user`;
CREATE TABLE `app_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `user_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `email` varchar(40) NOT NULL DEFAULT '' COMMENT '邮箱',
  `user_img` varchar(100) NOT NULL DEFAULT '' COMMENT '用户头像',
  `nick_name` varchar(20) DEFAULT NULL COMMENT '昵称',
  `sex` tinyint(1) NOT NULL DEFAULT '2' COMMENT '性别:0男1女2未知',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of app_user
-- ----------------------------

-- ----------------------------
-- Table structure for `app_valid_code`
-- ----------------------------
DROP TABLE IF EXISTS `app_valid_code`;
CREATE TABLE `app_valid_code` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `app_valid_code_id` varchar(36) NOT NULL DEFAULT '' COMMENT '验证码id',
  `email` varchar(40) NOT NULL DEFAULT '' COMMENT '邮箱',
  `valid_code` varchar(6) NOT NULL DEFAULT '' COMMENT '验证码',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_valid_code_id` (`app_valid_code_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of app_valid_code
-- ----------------------------

-- ----------------------------
-- Table structure for `product`
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `product_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品id',
  `name` varchar(40) NOT NULL DEFAULT '' COMMENT '商品名称',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '商品价格',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '商品状态0上架1下架',
  `desc` varchar(150) DEFAULT NULL COMMENT '商品描述',
  `small_img` varchar(100) NOT NULL DEFAULT '' COMMENT '商品图片',
  `large_img` varchar(100) NOT NULL DEFAULT '' COMMENT '详情图片',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('1', 'c462ba80-49a9-11ef-9030-ab301d4f7347', '玉米', '6.00', '0', '', 'c4624550-49a9-11ef-9030-ab301d4f7347.jpeg', '', '2024-07-24 18:44:56', '2024-08-15 17:37:47');
INSERT INTO `product` VALUES ('2', '258a7180-49ab-11ef-b1e1-c97be22f8d00', '上海青', '333.00', '0', '', '2589fc50-49ab-11ef-b1e1-c97be22f8d00.jpeg', '', '2024-07-24 18:54:48', '2024-08-15 17:37:47');
INSERT INTO `product` VALUES ('3', '0685f790-4cd6-11ef-8c0c-c9d417b22edd', '李知恩', '10000.00', '0', '', '0685a970-4cd6-11ef-8c0c-c9d417b22edd.jpeg', '', '2024-07-28 19:39:18', '2024-08-15 17:37:47');
INSERT INTO `product` VALUES ('4', '1fb76640-4cd6-11ef-8c0c-c9d417b22edd', '李知恩2', '1111.00', '0', '', '1fb71820-4cd6-11ef-8c0c-c9d417b22edd.jpeg', '', '2024-07-28 19:40:01', '2024-08-15 17:37:47');
INSERT INTO `product` VALUES ('5', '35bd1070-4cd6-11ef-8c0c-c9d417b22edd', '番茄', '66.00', '0', '', '35bcc250-4cd6-11ef-8c0c-c9d417b22edd.jpeg', '', '2024-07-28 19:40:38', '2024-08-15 17:37:47');
INSERT INTO `product` VALUES ('6', '4b1bf350-4cd6-11ef-8c0c-c9d417b22edd', '皮皮虾', '100.00', '0', '', '4b1bcc40-4cd6-11ef-8c0c-c9d417b22edd.jpeg', '', '2024-07-28 19:41:13', '2024-07-28 19:41:13');
INSERT INTO `product` VALUES ('7', '5bdda760-4cd6-11ef-8c0c-c9d417b22edd', '蜡笔小新', '5.00', '0', '', '5bdd5940-4cd6-11ef-8c0c-c9d417b22edd.png', '', '2024-07-28 19:41:41', '2024-07-28 19:41:41');

-- ----------------------------
-- Table structure for `product_type`
-- ----------------------------
DROP TABLE IF EXISTS `product_type`;
CREATE TABLE `product_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `type_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品类型id',
  `product_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品id',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of product_type
-- ----------------------------
INSERT INTO `product_type` VALUES ('1', '24490920-4740-11ef-b5cd-fd787eafbdd5', 'c462ba80-49a9-11ef-9030-ab301d4f7347', '2024-07-24 18:44:56', '2024-07-24 18:44:56');
INSERT INTO `product_type` VALUES ('2', '24490920-4740-11ef-b5cd-fd787eafbdd5', '258a7180-49ab-11ef-b1e1-c97be22f8d00', '2024-07-24 18:54:49', '2024-07-24 18:54:49');
INSERT INTO `product_type` VALUES ('3', '44caef70-4cd5-11ef-8c0c-c9d417b22edd', '0685f790-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:39:18', '2024-07-28 19:39:18');
INSERT INTO `product_type` VALUES ('4', '44caef70-4cd5-11ef-8c0c-c9d417b22edd', '1fb76640-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:40:01', '2024-07-28 19:40:01');
INSERT INTO `product_type` VALUES ('5', '24490920-4740-11ef-b5cd-fd787eafbdd5', '35bd1070-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:40:38', '2024-07-28 19:40:38');
INSERT INTO `product_type` VALUES ('6', '3efcc540-4cd6-11ef-8c0c-c9d417b22edd', '4b1bf350-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:41:13', '2024-07-28 19:41:13');
INSERT INTO `product_type` VALUES ('7', '44caef70-4cd5-11ef-8c0c-c9d417b22edd', '5bdda760-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:41:41', '2024-07-28 19:41:41');

-- ----------------------------
-- Table structure for `shopcart`
-- ----------------------------
DROP TABLE IF EXISTS `shopcart`;
CREATE TABLE `shopcart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `shopcart_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `product_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品id',
  `count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品数量',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shopcart_id` (`shopcart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of shopcart
-- ----------------------------

-- ----------------------------
-- Table structure for `type`
-- ----------------------------
DROP TABLE IF EXISTS `type`;
CREATE TABLE `type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `type_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品类型id',
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '商品类型',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_id` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of type
-- ----------------------------
INSERT INTO `type` VALUES ('15', '24490920-4740-11ef-b5cd-fd787eafbdd5', '蔬菜', '2024-07-21 17:03:48', '2024-07-21 17:03:48');
INSERT INTO `type` VALUES ('16', 'fb160ca0-4740-11ef-82fa-2b06b7ea7f3f', '家禽', '2024-07-21 17:09:48', '2024-07-21 17:09:48');
INSERT INTO `type` VALUES ('17', '44caef70-4cd5-11ef-8c0c-c9d417b22edd', '人', '2024-07-28 19:33:53', '2024-07-28 19:33:53');
INSERT INTO `type` VALUES ('18', '3efcc540-4cd6-11ef-8c0c-c9d417b22edd', '海鲜', '2024-07-28 19:40:53', '2024-07-28 19:40:53');
INSERT INTO `type` VALUES ('19', '872c80b0-5a57-11ef-8ef8-37062abb2cfb', '野兽', '2024-08-15 00:09:04', '2024-08-15 00:09:04');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `user_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `email` varchar(40) NOT NULL DEFAULT '' COMMENT '邮箱',
  `password` varchar(32) NOT NULL DEFAULT '' COMMENT '密码',
  `user_img` varchar(100) NOT NULL DEFAULT 'http://127.0.0.1:9000/98c66730-e152-11ec-8f09-bd354a750906.jpeg' COMMENT '用户头像',
  `phone` varchar(11) DEFAULT NULL COMMENT '手机号',
  `nick_name` varchar(20) DEFAULT NULL COMMENT '昵称',
  `sex` tinyint(1) DEFAULT '2' COMMENT '性别:0男1女2未知',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_level` tinyint(1) DEFAULT '2' COMMENT '用户等级：1管理员，2普通用户',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('8', '3fe049b0-473f-11ef-8f44-b532b72d673b', '123@qq.com', '68eac8ceef47aa3e20f31ee0d6b17e5e', 'c1985640-4740-11ef-931e-450414bf58b2.jpeg', '', '', '2', '2024-07-21 16:57:25', '2024-07-21 16:57:25', '2');

-- ----------------------------
-- Table structure for `user_product`
-- ----------------------------
DROP TABLE IF EXISTS `user_product`;
CREATE TABLE `user_product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `user_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `product_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品id',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_product
-- ----------------------------
INSERT INTO `user_product` VALUES ('1', '3fe049b0-473f-11ef-8f44-b532b72d673b', 'c462ba80-49a9-11ef-9030-ab301d4f7347', '2024-07-24 18:44:56', '2024-07-24 18:44:56');
INSERT INTO `user_product` VALUES ('2', '3fe049b0-473f-11ef-8f44-b532b72d673b', '258a7180-49ab-11ef-b1e1-c97be22f8d00', '2024-07-24 18:54:49', '2024-07-24 18:54:49');
INSERT INTO `user_product` VALUES ('3', '3fe049b0-473f-11ef-8f44-b532b72d673b', '0685f790-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:39:18', '2024-07-28 19:39:18');
INSERT INTO `user_product` VALUES ('4', '3fe049b0-473f-11ef-8f44-b532b72d673b', '1fb76640-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:40:01', '2024-07-28 19:40:01');
INSERT INTO `user_product` VALUES ('5', '3fe049b0-473f-11ef-8f44-b532b72d673b', '35bd1070-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:40:38', '2024-07-28 19:40:38');
INSERT INTO `user_product` VALUES ('6', '3fe049b0-473f-11ef-8f44-b532b72d673b', '4b1bf350-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:41:13', '2024-07-28 19:41:13');
INSERT INTO `user_product` VALUES ('7', '3fe049b0-473f-11ef-8f44-b532b72d673b', '5bdda760-4cd6-11ef-8c0c-c9d417b22edd', '2024-07-28 19:41:41', '2024-07-28 19:41:41');

-- ----------------------------
-- Table structure for `user_shopcart`
-- ----------------------------
DROP TABLE IF EXISTS `user_shopcart`;
CREATE TABLE `user_shopcart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `shopcart_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `user_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shopcart_id` (`shopcart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_shopcart
-- ----------------------------

-- ----------------------------
-- Table structure for `user_type`
-- ----------------------------
DROP TABLE IF EXISTS `user_type`;
CREATE TABLE `user_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `type_id` varchar(36) NOT NULL DEFAULT '' COMMENT '商品类型id',
  `user_id` varchar(36) NOT NULL DEFAULT '' COMMENT '用户id',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_id` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_type
-- ----------------------------
INSERT INTO `user_type` VALUES ('15', '24490920-4740-11ef-b5cd-fd787eafbdd5', '3fe049b0-473f-11ef-8f44-b532b72d673b', '2024-07-21 17:03:48', '2024-07-21 17:03:48');
INSERT INTO `user_type` VALUES ('16', 'fb160ca0-4740-11ef-82fa-2b06b7ea7f3f', '3fe049b0-473f-11ef-8f44-b532b72d673b', '2024-07-21 17:09:48', '2024-07-21 17:09:48');
INSERT INTO `user_type` VALUES ('17', '44caef70-4cd5-11ef-8c0c-c9d417b22edd', '3fe049b0-473f-11ef-8f44-b532b72d673b', '2024-07-28 19:33:53', '2024-07-28 19:33:53');
INSERT INTO `user_type` VALUES ('18', '3efcc540-4cd6-11ef-8c0c-c9d417b22edd', '3fe049b0-473f-11ef-8f44-b532b72d673b', '2024-07-28 19:40:53', '2024-07-28 19:40:53');
INSERT INTO `user_type` VALUES ('19', '872c80b0-5a57-11ef-8ef8-37062abb2cfb', '3fe049b0-473f-11ef-8f44-b532b72d673b', '2024-08-15 00:09:04', '2024-08-15 00:09:04');

-- ----------------------------
-- Table structure for `valid_code`
-- ----------------------------
DROP TABLE IF EXISTS `valid_code`;
CREATE TABLE `valid_code` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '表id',
  `valid_code_id` varchar(36) NOT NULL DEFAULT '' COMMENT '验证码id',
  `email` varchar(40) NOT NULL DEFAULT '' COMMENT '邮箱',
  `valid_code` varchar(6) NOT NULL DEFAULT '' COMMENT '验证码',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `valid_code_id` (`valid_code_id`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of valid_code
-- ----------------------------
INSERT INTO `valid_code` VALUES ('175', '327a91e0-473f-11ef-8f44-b532b72d673b', '', 'mEHgmm', '2024-07-21 16:57:02', '2024-07-21 16:57:02');
INSERT INTO `valid_code` VALUES ('176', '3bfbbc80-473f-11ef-8f44-b532b72d673b', '', 'gzDmgu', '2024-07-21 16:57:18', '2024-07-21 16:57:18');
INSERT INTO `valid_code` VALUES ('177', '4479a7f0-473f-11ef-8f44-b532b72d673b', '', 'yyyUyy', '2024-07-21 16:57:32', '2024-07-21 16:57:32');
INSERT INTO `valid_code` VALUES ('178', 'c16f0eb0-5a4c-11ef-8ef8-37062abb2cfb', '', 'HAdAmD', '2024-08-14 22:51:58', '2024-08-14 22:51:58');
INSERT INTO `valid_code` VALUES ('179', '5a819c80-5a4d-11ef-8ef8-37062abb2cfb', '', '71AAAA', '2024-08-14 22:56:14', '2024-08-14 22:56:14');
INSERT INTO `valid_code` VALUES ('180', '5baed1e0-5a4d-11ef-8ef8-37062abb2cfb', '', 'r6QI5I', '2024-08-14 22:56:16', '2024-08-14 22:56:16');
INSERT INTO `valid_code` VALUES ('181', '5cfb9d30-5a4d-11ef-8ef8-37062abb2cfb', '', 'WiWOyO', '2024-08-14 22:56:19', '2024-08-14 22:56:19');
INSERT INTO `valid_code` VALUES ('182', '5ddcfc80-5a4d-11ef-8ef8-37062abb2cfb', '', 'OTLLIO', '2024-08-14 22:56:20', '2024-08-14 22:56:20');
INSERT INTO `valid_code` VALUES ('183', '67a54240-5a4d-11ef-8ef8-37062abb2cfb', '', 'xOjxmj', '2024-08-14 22:56:36', '2024-08-14 22:56:36');
INSERT INTO `valid_code` VALUES ('184', '90ba8820-5a4d-11ef-8ef8-37062abb2cfb', '', 'jjZPRZ', '2024-08-14 22:57:45', '2024-08-14 22:57:45');
INSERT INTO `valid_code` VALUES ('185', '9cf888d0-5a4d-11ef-8ef8-37062abb2cfb', '', 'w4mfAf', '2024-08-14 22:58:06', '2024-08-14 22:58:06');
INSERT INTO `valid_code` VALUES ('186', 'b7a043d0-5a4d-11ef-8ef8-37062abb2cfb', '', 'H6h4KN', '2024-08-14 22:58:51', '2024-08-14 22:58:51');
INSERT INTO `valid_code` VALUES ('187', 'ba04e7c0-5a4d-11ef-8ef8-37062abb2cfb', '', 'T4ug88', '2024-08-14 22:58:55', '2024-08-14 22:58:55');
INSERT INTO `valid_code` VALUES ('188', 'c23612c0-5a4d-11ef-8ef8-37062abb2cfb', '', 'GJJCGC', '2024-08-14 22:59:08', '2024-08-14 22:59:08');
INSERT INTO `valid_code` VALUES ('189', 'c2f51d00-5a4d-11ef-8ef8-37062abb2cfb', '', '1jjgs1', '2024-08-14 22:59:10', '2024-08-14 22:59:10');
INSERT INTO `valid_code` VALUES ('190', 'c37dfc10-5a4d-11ef-8ef8-37062abb2cfb', '', '6hb6N6', '2024-08-14 22:59:11', '2024-08-14 22:59:11');
INSERT INTO `valid_code` VALUES ('191', 'c54834c0-5a4d-11ef-8ef8-37062abb2cfb', '', 'SQODSj', '2024-08-14 22:59:14', '2024-08-14 22:59:14');
INSERT INTO `valid_code` VALUES ('192', 'c66b7f10-5a4d-11ef-8ef8-37062abb2cfb', '', 'XpHXXm', '2024-08-14 22:59:15', '2024-08-14 22:59:15');
INSERT INTO `valid_code` VALUES ('193', 'ea8dd500-5a4d-11ef-8ef8-37062abb2cfb', '', 'D2jlLl', '2024-08-14 23:00:16', '2024-08-14 23:00:16');
INSERT INTO `valid_code` VALUES ('194', 'ec3606c0-5a4d-11ef-8ef8-37062abb2cfb', '', 'YtYYY3', '2024-08-14 23:00:19', '2024-08-14 23:00:19');
INSERT INTO `valid_code` VALUES ('195', 'ec373f40-5a4d-11ef-8ef8-37062abb2cfb', '', 'oRoqJ7', '2024-08-14 23:00:19', '2024-08-14 23:00:19');
INSERT INTO `valid_code` VALUES ('196', 'edc58060-5a4d-11ef-8ef8-37062abb2cfb', '', 'IIID0I', '2024-08-14 23:00:21', '2024-08-14 23:00:21');
INSERT INTO `valid_code` VALUES ('197', 'edc49600-5a4d-11ef-8ef8-37062abb2cfb', '', 'Eprppp', '2024-08-14 23:00:21', '2024-08-14 23:00:21');
INSERT INTO `valid_code` VALUES ('198', 'f0be26f0-5a4d-11ef-8ef8-37062abb2cfb', '', 'm25777', '2024-08-14 23:00:26', '2024-08-14 23:00:26');
INSERT INTO `valid_code` VALUES ('199', 'f0ecd810-5a4d-11ef-8ef8-37062abb2cfb', '', 'hnSqIS', '2024-08-14 23:00:27', '2024-08-14 23:00:27');
INSERT INTO `valid_code` VALUES ('200', 'f2f3a490-5a4d-11ef-8ef8-37062abb2cfb', '', 'VuFuFF', '2024-08-14 23:00:30', '2024-08-14 23:00:30');
INSERT INTO `valid_code` VALUES ('201', 'f2f48ef0-5a4d-11ef-8ef8-37062abb2cfb', '', 'XxddcX', '2024-08-14 23:00:30', '2024-08-14 23:00:30');
INSERT INTO `valid_code` VALUES ('202', 'f5003d70-5a4d-11ef-8ef8-37062abb2cfb', '', 'N1w1YN', '2024-08-14 23:00:34', '2024-08-14 23:00:34');
INSERT INTO `valid_code` VALUES ('203', 'f52f63c0-5a4d-11ef-8ef8-37062abb2cfb', '', 'HYcUcH', '2024-08-14 23:00:34', '2024-08-14 23:00:34');
INSERT INTO `valid_code` VALUES ('204', '00104570-5a4e-11ef-8ef8-37062abb2cfb', '', 'iPKPiV', '2024-08-14 23:00:52', '2024-08-14 23:00:52');
INSERT INTO `valid_code` VALUES ('205', '01973390-5a4e-11ef-8ef8-37062abb2cfb', '', 'ELOrkE', '2024-08-14 23:00:55', '2024-08-14 23:00:55');
INSERT INTO `valid_code` VALUES ('206', '0198e140-5a4e-11ef-8ef8-37062abb2cfb', '', 'NkPPNk', '2024-08-14 23:00:55', '2024-08-14 23:00:55');
INSERT INTO `valid_code` VALUES ('207', '12c8e780-5a4e-11ef-8ef8-37062abb2cfb', '', '9UKpkk', '2024-08-14 23:01:24', '2024-08-14 23:01:24');
INSERT INTO `valid_code` VALUES ('208', '19cfea60-5a4e-11ef-8ef8-37062abb2cfb', '', 'lZaa9l', '2024-08-14 23:01:35', '2024-08-14 23:01:35');
INSERT INTO `valid_code` VALUES ('209', '1c407530-5a4e-11ef-8ef8-37062abb2cfb', '', 'IDwIDD', '2024-08-14 23:01:39', '2024-08-14 23:01:39');
INSERT INTO `valid_code` VALUES ('210', '4d561210-5a4e-11ef-8ef8-37062abb2cfb', '', 'BAAzz0', '2024-08-14 23:03:02', '2024-08-14 23:03:02');
INSERT INTO `valid_code` VALUES ('211', '5002e290-5a4e-11ef-8ef8-37062abb2cfb', '', 'vvPPHi', '2024-08-14 23:03:06', '2024-08-14 23:03:06');
INSERT INTO `valid_code` VALUES ('212', '513c7400-5a4e-11ef-8ef8-37062abb2cfb', '', 'ovvov9', '2024-08-14 23:03:08', '2024-08-14 23:03:08');
INSERT INTO `valid_code` VALUES ('213', '53645d10-5a4e-11ef-8ef8-37062abb2cfb', '', 'Z6lZZJ', '2024-08-14 23:03:12', '2024-08-14 23:03:12');
INSERT INTO `valid_code` VALUES ('214', 'f3e64c80-5a4e-11ef-8ef8-37062abb2cfb', '', 'XkV9Uk', '2024-08-14 23:07:41', '2024-08-14 23:07:41');
INSERT INTO `valid_code` VALUES ('215', 'ffb69740-5a4e-11ef-8ef8-37062abb2cfb', '', 'pHpkkH', '2024-08-14 23:08:01', '2024-08-14 23:08:01');
INSERT INTO `valid_code` VALUES ('216', '08cdb570-5a4f-11ef-8ef8-37062abb2cfb', '', 'yVnyzR', '2024-08-14 23:08:16', '2024-08-14 23:08:16');
INSERT INTO `valid_code` VALUES ('217', '10f6f130-5a4f-11ef-8ef8-37062abb2cfb', '', 'vvJggv', '2024-08-14 23:08:30', '2024-08-14 23:08:30');
INSERT INTO `valid_code` VALUES ('218', '151be2c0-5a4f-11ef-8ef8-37062abb2cfb', '', 'sRLjj8', '2024-08-14 23:08:37', '2024-08-14 23:08:37');
INSERT INTO `valid_code` VALUES ('219', '34422100-5a4f-11ef-8ef8-37062abb2cfb', '', 'IJJNNJ', '2024-08-14 23:09:29', '2024-08-14 23:09:29');
INSERT INTO `valid_code` VALUES ('220', '3b33c720-5a4f-11ef-8ef8-37062abb2cfb', '', 'f3IR3f', '2024-08-14 23:09:41', '2024-08-14 23:09:41');
INSERT INTO `valid_code` VALUES ('221', '4eb53770-5a4f-11ef-8ef8-37062abb2cfb', '', 'TJJTTj', '2024-08-14 23:10:14', '2024-08-14 23:10:14');
INSERT INTO `valid_code` VALUES ('222', '89722490-5a4f-11ef-8ef8-37062abb2cfb', '', '2z99iq', '2024-08-14 23:11:52', '2024-08-14 23:11:52');
INSERT INTO `valid_code` VALUES ('223', '9a0b1af0-5a4f-11ef-8ef8-37062abb2cfb', '', 'rr444D', '2024-08-14 23:12:20', '2024-08-14 23:12:20');
INSERT INTO `valid_code` VALUES ('224', '9e71a960-5a4f-11ef-8ef8-37062abb2cfb', '', 'rr11rj', '2024-08-14 23:12:27', '2024-08-14 23:12:27');
INSERT INTO `valid_code` VALUES ('225', 'a9c63470-5a4f-11ef-8ef8-37062abb2cfb', '', 'eeMM8j', '2024-08-14 23:12:46', '2024-08-14 23:12:46');
INSERT INTO `valid_code` VALUES ('226', 'b0e37e70-5a4f-11ef-8ef8-37062abb2cfb', '', 'EwBNwF', '2024-08-14 23:12:58', '2024-08-14 23:12:58');
INSERT INTO `valid_code` VALUES ('227', 'e0a969d0-5a4f-11ef-8ef8-37062abb2cfb', '', 'Onuoun', '2024-08-14 23:14:18', '2024-08-14 23:14:18');
INSERT INTO `valid_code` VALUES ('228', 'ea956430-5a4f-11ef-8ef8-37062abb2cfb', '', 'ohkoko', '2024-08-14 23:14:35', '2024-08-14 23:14:35');
INSERT INTO `valid_code` VALUES ('229', 'edebbb20-5a4f-11ef-8ef8-37062abb2cfb', '', 'eCeIcI', '2024-08-14 23:14:41', '2024-08-14 23:14:41');
INSERT INTO `valid_code` VALUES ('230', 'f1a2cfb0-5a4f-11ef-8ef8-37062abb2cfb', '', 'TzOMMM', '2024-08-14 23:14:47', '2024-08-14 23:14:47');
INSERT INTO `valid_code` VALUES ('231', 'ffc743a0-5a4f-11ef-8ef8-37062abb2cfb', '', 'PrAV8r', '2024-08-14 23:15:11', '2024-08-14 23:15:11');
INSERT INTO `valid_code` VALUES ('232', '03c01c20-5a50-11ef-8ef8-37062abb2cfb', '', 'qjBbq5', '2024-08-14 23:15:17', '2024-08-14 23:15:17');
INSERT INTO `valid_code` VALUES ('233', '1030eca0-5a50-11ef-8ef8-37062abb2cfb', '', '9gqggf', '2024-08-14 23:15:38', '2024-08-14 23:15:38');
INSERT INTO `valid_code` VALUES ('234', '2e583170-5a50-11ef-8ef8-37062abb2cfb', '', 'wIIgAw', '2024-08-14 23:16:29', '2024-08-14 23:16:29');
INSERT INTO `valid_code` VALUES ('235', '3372cda0-5a50-11ef-8ef8-37062abb2cfb', '', 'bAWWbY', '2024-08-14 23:16:37', '2024-08-14 23:16:37');
INSERT INTO `valid_code` VALUES ('236', '4627ed40-5a50-11ef-8ef8-37062abb2cfb', '', '10GZZG', '2024-08-14 23:17:09', '2024-08-14 23:17:09');
INSERT INTO `valid_code` VALUES ('237', '5ba888f0-5a50-11ef-8ef8-37062abb2cfb', '', 'aRraRI', '2024-08-14 23:17:45', '2024-08-14 23:17:45');
INSERT INTO `valid_code` VALUES ('238', '628c4c60-5a50-11ef-8ef8-37062abb2cfb', '', 'CCSClE', '2024-08-14 23:17:56', '2024-08-14 23:17:56');
INSERT INTO `valid_code` VALUES ('239', '69130640-5a51-11ef-8ef8-37062abb2cfb', '', 'ACRCCk', '2024-08-14 23:25:17', '2024-08-14 23:25:17');
INSERT INTO `valid_code` VALUES ('240', '7eb22670-5a51-11ef-8ef8-37062abb2cfb', '', 'MrMMRM', '2024-08-14 23:25:53', '2024-08-14 23:25:53');
INSERT INTO `valid_code` VALUES ('241', '824203f0-5a51-11ef-8ef8-37062abb2cfb', '', 'BbSXbB', '2024-08-14 23:25:59', '2024-08-14 23:25:59');
INSERT INTO `valid_code` VALUES ('242', '959b04b0-5a51-11ef-8ef8-37062abb2cfb', '', 'zekzke', '2024-08-14 23:26:32', '2024-08-14 23:26:32');
INSERT INTO `valid_code` VALUES ('243', '9d187010-5a51-11ef-8ef8-37062abb2cfb', '', 'bbtbKK', '2024-08-14 23:26:44', '2024-08-14 23:26:44');
INSERT INTO `valid_code` VALUES ('244', 'aa87ebe0-5a51-11ef-8ef8-37062abb2cfb', '', 'XXGXGG', '2024-08-14 23:27:07', '2024-08-14 23:27:07');
INSERT INTO `valid_code` VALUES ('245', 'bcf52d10-5a51-11ef-8ef8-37062abb2cfb', '', 'RR3TYY', '2024-08-14 23:27:38', '2024-08-14 23:27:38');
INSERT INTO `valid_code` VALUES ('246', 'bec4e400-5a51-11ef-8ef8-37062abb2cfb', '', 'T1GGG5', '2024-08-14 23:27:41', '2024-08-14 23:27:41');
INSERT INTO `valid_code` VALUES ('247', 'd32d8000-5a51-11ef-8ef8-37062abb2cfb', '', 'ssz0Qe', '2024-08-14 23:28:15', '2024-08-14 23:28:15');
INSERT INTO `valid_code` VALUES ('248', 'f539a020-5a51-11ef-8ef8-37062abb2cfb', '', 'cL4cqq', '2024-08-14 23:29:12', '2024-08-14 23:29:12');
INSERT INTO `valid_code` VALUES ('249', '039306c0-5a52-11ef-8ef8-37062abb2cfb', '', 'tofffB', '2024-08-14 23:29:36', '2024-08-14 23:29:36');
INSERT INTO `valid_code` VALUES ('250', '054e4b50-5a52-11ef-8ef8-37062abb2cfb', '', 'll9kll', '2024-08-14 23:29:39', '2024-08-14 23:29:39');
INSERT INTO `valid_code` VALUES ('251', '13c943b0-5a52-11ef-8ef8-37062abb2cfb', '', 'IIkTT5', '2024-08-14 23:30:03', '2024-08-14 23:30:03');
INSERT INTO `valid_code` VALUES ('252', '433f3a50-5a52-11ef-8ef8-37062abb2cfb', '', '7NN0i0', '2024-08-14 23:31:23', '2024-08-14 23:31:23');
INSERT INTO `valid_code` VALUES ('253', '4a856910-5a52-11ef-8ef8-37062abb2cfb', '', 'k9L9P9', '2024-08-14 23:31:35', '2024-08-14 23:31:35');
INSERT INTO `valid_code` VALUES ('254', '4d9b82b0-5a52-11ef-8ef8-37062abb2cfb', '', 'LjhhLL', '2024-08-14 23:31:40', '2024-08-14 23:31:40');
INSERT INTO `valid_code` VALUES ('255', '5bd3f3d0-5a52-11ef-8ef8-37062abb2cfb', '', '6Qe226', '2024-08-14 23:32:04', '2024-08-14 23:32:04');
INSERT INTO `valid_code` VALUES ('256', 'fef87a90-5a52-11ef-8ef8-37062abb2cfb', '', 'mddmzm', '2024-08-14 23:36:38', '2024-08-14 23:36:38');
INSERT INTO `valid_code` VALUES ('257', '08624ca0-5a53-11ef-8ef8-37062abb2cfb', '', 'VhVhVV', '2024-08-14 23:36:54', '2024-08-14 23:36:54');
INSERT INTO `valid_code` VALUES ('258', '1f25efa0-5a53-11ef-8ef8-37062abb2cfb', '', 'iDo2iN', '2024-08-14 23:37:32', '2024-08-14 23:37:32');
INSERT INTO `valid_code` VALUES ('259', '25666e30-5a53-11ef-8ef8-37062abb2cfb', '', '9epfAe', '2024-08-14 23:37:42', '2024-08-14 23:37:42');
INSERT INTO `valid_code` VALUES ('260', '3c539cc0-5a54-11ef-8ef8-37062abb2cfb', '', 'YzYw0w', '2024-08-14 23:45:30', '2024-08-14 23:45:30');
INSERT INTO `valid_code` VALUES ('261', 'adff5800-5a54-11ef-8ef8-37062abb2cfb', '', 'Zxczcz', '2024-08-14 23:48:41', '2024-08-14 23:48:41');
INSERT INTO `valid_code` VALUES ('262', 'bfbe09b0-5a54-11ef-8ef8-37062abb2cfb', '', 'DiDzDM', '2024-08-14 23:49:11', '2024-08-14 23:49:11');
