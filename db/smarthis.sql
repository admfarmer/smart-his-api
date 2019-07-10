/*
 Navicat Premium Data Transfer

 Source Server         : mariadb-3310
 Source Server Type    : MySQL
 Source Server Version : 100313
 Source Host           : localhost:3310
 Source Schema         : smarthis

 Target Server Type    : MySQL
 Target Server Version : 100313
 File Encoding         : 65001

 Date: 25/05/2019 17:57:31
*/


-- ----------------------------
-- Table structure for his_diag
-- ----------------------------
DROP TABLE IF EXISTS `his_diag`;
CREATE TABLE `his_diag` (
  `vn` int(11) NOT NULL,
  `hn` int(8) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `sex` varchar(10) NOT NULL COMMENT ' ',
  `address` varchar(200) NOT NULL,
  `pttype` varchar(10) NOT NULL,
  `diag` varchar(10) NOT NULL,
  `diagname` varchar(200) NOT NULL,
  `vstdttm` datetime NOT NULL,
  `drxtime` time NOT NULL,
  `update` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`vn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for his_lab
-- ----------------------------
DROP TABLE IF EXISTS `his_lab`;
CREATE TABLE `his_lab` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hn` int(8) NOT NULL,
  `labcode` varchar(3) NOT NULL,
  `vstdttm` datetime NOT NULL,
  `hcode` varchar(10) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for his_system
-- ----------------------------
DROP TABLE IF EXISTS `his_system`;
CREATE TABLE `his_system` (
  `hoscode` varchar(50) NOT NULL,
  `hosname` varchar(200) DEFAULT NULL,
  `topic` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`hoscode`) USING BTREE,
  UNIQUE KEY `idx_hoscode` (`hoscode`) USING BTREE,
  UNIQUE KEY `idx_topic` (`topic`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of his_system
-- ----------------------------
BEGIN;
INSERT INTO `his_system` VALUES ('10957', 'โรงพยาบาลตาลสุม', '4555654443');
COMMIT;

-- ----------------------------
-- Table structure for his_users
-- ----------------------------
DROP TABLE IF EXISTS `his_users`;
CREATE TABLE `his_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(256) DEFAULT NULL,
  `user_type` enum('ADMIN','MEMBER') DEFAULT 'MEMBER',
  `hcode` varchar(10) DEFAULT NULL,
  `is_active` char(1) DEFAULT 'Y',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE KEY `idx_username` (`username`) USING BTREE,
  KEY `idx_password` (`password`(255)) USING BTREE,
  KEY `idx_is_active` (`is_active`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of his_users
-- ----------------------------
BEGIN;
INSERT INTO `his_users` VALUES (1, 'ธวัชชัย แสงเดือน', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'ADMIN', NULL, 'Y');
COMMIT;

-- ----------------------------
-- Table structure for his_visit
-- ----------------------------
DROP TABLE IF EXISTS `his_visit`;
CREATE TABLE `his_visit` (
  `hn` int(8) NOT NULL,
  `cid` varchar(13) NOT NULL,
  `vstdttm` datetime NOT NULL,
  `cln` varchar(20) NOT NULL,
  `pttype` varchar(5) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `sex` varchar(1) NOT NULL,
  `birthdate` date NOT NULL,
  `hcode` varchar(10) NOT NULL,
  PRIMARY KEY (`hn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
