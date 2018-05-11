-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.6.31-log - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 newsroom 的数据库结构
CREATE DATABASE IF NOT EXISTS `newsroom` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `newsroom`;

-- 导出  表 newsroom.announcements 结构
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '公告标题',
  `content` text NOT NULL COMMENT '公告内容',
  `upload` text NOT NULL COMMENT '公告附件',
  `date_pub` datetime NOT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='公告';

-- 正在导出表  newsroom.announcements 的数据：~0 rows (大约)
DELETE FROM `announcements`;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;

-- 导出  表 newsroom.articles 结构
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT '稿件标题',
  `format` varchar(255) NOT NULL COMMENT '稿件格式，以分号串的格式存储',
  `academicsec` int(11) NOT NULL COMMENT '学术领域编号',
  `column` int(11) NOT NULL COMMENT '栏目',
  `keyword1_cn` varchar(255) NOT NULL,
  `keyword2_cn` varchar(255) DEFAULT NULL,
  `keyword3_cn` varchar(255) DEFAULT NULL,
  `keyword4_cn` varchar(255) DEFAULT NULL,
  `keyword1_en` varchar(255) DEFAULT NULL,
  `keyword2_en` varchar(255) DEFAULT NULL,
  `keyword3_en` varchar(255) DEFAULT NULL,
  `keyword4_en` varchar(255) DEFAULT NULL,
  `summary_cn` varchar(255) NOT NULL,
  `summary_en` varchar(255) DEFAULT NULL,
  `writer_id` int(11) NOT NULL COMMENT '投稿人id',
  `writers_info` text NOT NULL COMMENT '作者信息的格式化串',
  `writer_prefer` varchar(255) DEFAULT NULL COMMENT '作者倾向审稿人，以分号分割',
  `writer_avoid` varchar(255) DEFAULT NULL COMMENT '作者回避，以分号分割',
  `date_sub` datetime NOT NULL COMMENT '稿件创建时间',
  `date_pub` datetime DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  KEY `FK_articles_authors` (`writer_id`),
  KEY `FK_articles_academicsec` (`academicsec`),
  KEY `FK_articles_column` (`column`),
  CONSTRAINT `FK_articles_academicsec` FOREIGN KEY (`academicsec`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_articles_authors` FOREIGN KEY (`writer_id`) REFERENCES `authors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_articles_column` FOREIGN KEY (`column`) REFERENCES `type_column` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='稿件信息';

-- 正在导出表  newsroom.articles 的数据：~2 rows (大约)
DELETE FROM `articles`;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` (`id`, `title`, `format`, `academicsec`, `column`, `keyword1_cn`, `keyword2_cn`, `keyword3_cn`, `keyword4_cn`, `keyword1_en`, `keyword2_en`, `keyword3_en`, `keyword4_en`, `summary_cn`, `summary_en`, `writer_id`, `writers_info`, `writer_prefer`, `writer_avoid`, `date_sub`, `date_pub`) VALUES
	(1, '测试1', '.docx;.rar', 1, 1, '测试1', NULL, NULL, NULL, 'test1', NULL, NULL, NULL, '测试1', 'test', 1, 'test1', NULL, NULL, '2018-03-03 10:30:08', '2018-03-31 23:59:59'),
	(2, '测试2', '.docx;.rar', 1, 2, '测试2', NULL, NULL, NULL, 'test2', NULL, NULL, NULL, '测试2', 'test2', 2, 'test2', NULL, NULL, '2018-05-03 10:30:09', '2018-09-01 08:00:02');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;

-- 导出  过程 newsroom.articles insert 结构
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `articles insert`()
BEGIN
DECLARE i int;
set i=1;
WHILE i<20000 do
INSERT INTO `newsroom`.`articles` (`title`, `format`, `academicsec`, `keyword1_cn`, `keyword2_cn`, `keyword3_cn`, `keyword4_cn`, `keyword1_en`, `keyword2_en`, `keyword3_en`, `keyword4_en`, `summary_cn`, `summary_en`, `writer_id`, `writers_info`, `date_pub`) 
VALUES (CONCAT("title",i), 'doc;', CONCAT("",(i%3)+1), CONCAT("keyword_cn",i), '三大', 'e', 'a',CONCAT("keyword_en",i), 's', 'c', 's', CONCAT("summary_cn",i), NULL, '2', '{\"a\":\"111\"}','2018-03-13 00:00:00');
SET i=i+1; 
END 
WHILE;

END//
DELIMITER ;

-- 导出  表 newsroom.authors 结构
CREATE TABLE IF NOT EXISTS `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `name` varchar(255) NOT NULL COMMENT '姓名',
  `name_pinyin` varchar(255) NOT NULL COMMENT '姓名的全拼',
  `gender` int(11) NOT NULL COMMENT '性别',
  `address` text NOT NULL COMMENT '通信地址',
  `postcode` varchar(255) NOT NULL COMMENT '邮编',
  `workspace_cn` text NOT NULL COMMENT '单位中文名',
  `workspace_en` text COMMENT '单位英文名',
  `major` int(11) NOT NULL COMMENT '专业编号',
  `education` int(11) NOT NULL COMMENT '学历编号',
  `title` varchar(255) DEFAULT NULL COMMENT '职称',
  `officetel` varchar(255) NOT NULL COMMENT '办公室电话',
  `phonenum` varchar(255) DEFAULT NULL COMMENT '手机',
  `location` int(255) NOT NULL COMMENT '国家/地区编号',
  `researchdir` varchar(255) NOT NULL COMMENT '研究方向',
  `academicsec1` int(11) NOT NULL COMMENT '学术领域编号',
  `academicsec2` int(11) DEFAULT NULL,
  `academicsec3` int(11) DEFAULT NULL,
  `introduction` text NOT NULL COMMENT '个人介绍',
  `safeque1` text NOT NULL COMMENT '密保问题1',
  `safeque2` text NOT NULL COMMENT '密保问题2',
  `safeque3` text NOT NULL COMMENT '密保问题3',
  `alive` int(11) NOT NULL COMMENT '有效状态',
  PRIMARY KEY (`id`),
  KEY `FK_authors_type_major` (`major`),
  KEY `FK_authors_type_education` (`education`),
  KEY `FK_authors_type_location` (`location`),
  KEY `FK_authors_type_academicsec` (`academicsec1`),
  KEY `FK_authors_type_academicsec2` (`academicsec2`),
  KEY `FK_authors_type_academicsec3` (`academicsec3`),
  CONSTRAINT `FK_authors_type_academicsec1` FOREIGN KEY (`academicsec1`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_authors_type_academicsec2` FOREIGN KEY (`academicsec2`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_authors_type_academicsec3` FOREIGN KEY (`academicsec3`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_authors_type_education` FOREIGN KEY (`education`) REFERENCES `type_education` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_authors_type_location` FOREIGN KEY (`location`) REFERENCES `type_location` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_authors_type_major` FOREIGN KEY (`major`) REFERENCES `type_major` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='作者信息';

-- 正在导出表  newsroom.authors 的数据：~3 rows (大约)
DELETE FROM `authors`;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` (`id`, `email`, `password`, `name`, `name_pinyin`, `gender`, `address`, `postcode`, `workspace_cn`, `workspace_en`, `major`, `education`, `title`, `officetel`, `phonenum`, `location`, `researchdir`, `academicsec1`, `academicsec2`, `academicsec3`, `introduction`, `safeque1`, `safeque2`, `safeque3`, `alive`) VALUES
	(1, '123@qq.com', '12345678', '测试1', 'ceshi', 1, '测试', '100000', '测试', 'test', 1, 1, '教授', '12345', '11111111111', 1, '医学', 1, NULL, NULL, '测试', '1;123', '2;123', '3;123', 1),
	(2, '1234@qq.com', '12345678', '测试2', 'ceshi', 1, '测试2', '100000', '测试2', 'test2', 1, 1, '教授', '12345', '11111111111', 1, '医学', 1, NULL, NULL, '测试2', '1;123', '2;123', '3;123', 1),
	(3, '12345@qq.com', '12345678', '测试3', 'ceshi', 1, '测试3', '100000', '测试3', 'test3', 1, 1, '教授', '12345', '11111111111', 1, '医学', 1, NULL, NULL, '测试3', '1;123', '2;123', '3;123', 1);
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;

-- 导出  表 newsroom.bank_safeque 结构
CREATE TABLE IF NOT EXISTS `bank_safeque` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `safeque` text NOT NULL COMMENT '密保问题题目',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.bank_safeque 的数据：~4 rows (大约)
DELETE FROM `bank_safeque`;
/*!40000 ALTER TABLE `bank_safeque` DISABLE KEYS */;
INSERT INTO `bank_safeque` (`id`, `safeque`) VALUES
	(1, '你的名字？'),
	(2, '你最喜欢的人的名字？'),
	(3, '你的爱人的名字？'),
	(4, '你的幸运数字？');
/*!40000 ALTER TABLE `bank_safeque` ENABLE KEYS */;

-- 导出  表 newsroom.editors 结构
CREATE TABLE IF NOT EXISTS `editors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '工号',
  `password` varchar(255) NOT NULL DEFAULT '12345678' COMMENT '密码',
  `name` varchar(255) NOT NULL COMMENT '编辑姓名',
  `gender` int(11) NOT NULL COMMENT '编辑性别',
  `role` int(11) NOT NULL COMMENT '编辑等级标记，包含两种状态：\r\n（1）主编：0\r\n（2）编辑：1\r\n',
  `safeque1` text NOT NULL COMMENT '密保问题',
  `safeque2` text NOT NULL COMMENT '密保问题2',
  `safeque3` text NOT NULL COMMENT '密保问题3',
  `alive` int(11) NOT NULL DEFAULT '1' COMMENT '有效状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='编辑信息';

-- 正在导出表  newsroom.editors 的数据：~3 rows (大约)
DELETE FROM `editors`;
/*!40000 ALTER TABLE `editors` DISABLE KEYS */;
INSERT INTO `editors` (`id`, `username`, `password`, `name`, `gender`, `role`, `safeque1`, `safeque2`, `safeque3`, `alive`) VALUES
	(1, 'chief', '12345678', '主编', 2, 0, '1;123', '2;123', '3;123', 1),
	(2, 'editor1', '12345678', '编辑1', 1, 0, '1;123', '2;123', '3;123', 1),
	(3, 'editor2', '12345678', '编辑2', 1, 0, '1;123', '2;123', '3;123', 1);
/*!40000 ALTER TABLE `editors` ENABLE KEYS */;

-- 导出  表 newsroom.invoices 结构
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_article` int(11) NOT NULL COMMENT '稿件id',
  `flag` int(11) DEFAULT NULL COMMENT '是否需要发票标记',
  `format` varchar(255) NOT NULL COMMENT '票据格式',
  `receipt_title` varchar(255) DEFAULT NULL COMMENT '发票抬头',
  `receipt_num` varchar(255) DEFAULT NULL COMMENT '发票税号',
  `address` text COMMENT '邮寄地址',
  `receiver` varchar(255) DEFAULT NULL COMMENT '收件人',
  `type` int(11) NOT NULL COMMENT '费用类型',
  `expense` int(255) NOT NULL COMMENT '应缴金额',
  `date` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `FK_invoices_articles` (`id_article`),
  CONSTRAINT `FK_invoices_articles` FOREIGN KEY (`id_article`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.invoices 的数据：~0 rows (大约)
DELETE FROM `invoices`;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;

-- 导出  表 newsroom.newsroominfo 结构
CREATE TABLE IF NOT EXISTS `newsroominfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL COMMENT '期刊年份',
  `standard` int(11) NOT NULL COMMENT '期刊制式',
  `content` text,
  `admin` varchar(255) NOT NULL COMMENT '管理员用户名',
  `password` varchar(255) NOT NULL COMMENT '管理员密码',
  `reviewfee` int(11) NOT NULL DEFAULT '60' COMMENT ' 审稿费',
  `pagecharges` int(11) NOT NULL DEFAULT '100' COMMENT '版面费',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.newsroominfo 的数据：~1 rows (大约)
DELETE FROM `newsroominfo`;
/*!40000 ALTER TABLE `newsroominfo` DISABLE KEYS */;
INSERT INTO `newsroominfo` (`id`, `year`, `standard`, `content`, `admin`, `password`, `reviewfee`, `pagecharges`) VALUES
	(1, 2018, 4, '{"ddl":[1522511999000,1530374399000,1538323199000,1546271999000],"num":[20,20,20,20]}', 'admin', '12345678', 60, 100);
/*!40000 ALTER TABLE `newsroominfo` ENABLE KEYS */;

-- 导出  过程 newsroom.professor insert 结构
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `professor insert`()
BEGIN
DECLARE i int;
set i=1;
WHILE i<50000 do
INSERT INTO `newsroom`.`professors` (`username`, `password`, `name`, `gender`, `academicsec`, `safeque1`, `safeque2`, `safeque3`) VALUES (CONCAT('201522',i), CONCAT('czlpwd',i), CONCAT('czl',i), '1', '3', '1,a1', '2,a2', '3,a3');

SET i=i+1; 
END 
WHILE;

END//
DELIMITER ;

-- 导出  表 newsroom.professors 结构
CREATE TABLE IF NOT EXISTS `professors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '工号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `name` varchar(255) NOT NULL COMMENT '审稿人姓名',
  `gender` int(11) NOT NULL COMMENT '审稿人性别',
  `card` varchar(255) NOT NULL COMMENT '银行卡号',
  `academicsec1` int(11) NOT NULL COMMENT '审稿人学术领域编号',
  `academicsec2` int(11) DEFAULT NULL,
  `academicsec3` int(11) DEFAULT NULL,
  `safeque1` text NOT NULL COMMENT '密保问题1',
  `safeque2` text NOT NULL COMMENT '密保问题2',
  `safeque3` text NOT NULL COMMENT '密保问题3',
  `alive` int(11) NOT NULL DEFAULT '1' COMMENT '有效状态',
  PRIMARY KEY (`id`),
  KEY `FK_professors_academicsec` (`academicsec1`),
  KEY `FK_professors_type_academicsec2` (`academicsec2`),
  KEY `FK_professors_type_academicsec3` (`academicsec3`),
  CONSTRAINT `FK_professors_academicsec1` FOREIGN KEY (`academicsec1`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_professors_type_academicsec2` FOREIGN KEY (`academicsec2`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_professors_type_academicsec3` FOREIGN KEY (`academicsec3`) REFERENCES `type_academicsec` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='审稿人信息';

-- 正在导出表  newsroom.professors 的数据：~3 rows (大约)
DELETE FROM `professors`;
/*!40000 ALTER TABLE `professors` DISABLE KEYS */;
INSERT INTO `professors` (`id`, `username`, `password`, `name`, `gender`, `card`, `academicsec1`, `academicsec2`, `academicsec3`, `safeque1`, `safeque2`, `safeque3`, `alive`) VALUES
	(1, '1234@qq.com', '12345678', '审稿人1', 1, '1111111111111111', 1, NULL, NULL, '1;123', '2;123', '3;123', 1),
	(2, '1235@qq.com', '12345678', '审稿人2', 2, '2222222222222222', 1, NULL, NULL, '1;123', '2;123', '3;123', 1),
	(3, '1236@qq.com', '12345678', '审稿人3', 2, '3333333333333333', 1, NULL, NULL, '1;123', '2;123', '3;123', 1);
/*!40000 ALTER TABLE `professors` ENABLE KEYS */;

-- 导出  表 newsroom.tasks 结构
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_article` int(11) NOT NULL COMMENT '稿件id',
  `id_role` int(11) NOT NULL COMMENT '稿件处理人id',
  `content` text COMMENT '审核结果详细内容',
  `stat` int(11) NOT NULL COMMENT '稿件状态，包含7个状态：\r\n（1）：未分配：0\r\n（2）：审阅中：1\r\n（3）：未通过：2\r\n（4）：待修改：3\r\n（5）：通过：4\r\n（6）：格式确认：5\r\n（7）：缴费：6\r\n（8）：重审：7',
  `role` int(11) NOT NULL COMMENT '角色表名编号，包含4个值：\r\n（1）作者：1\r\n（2）主编：2\r\n（3）编辑：3\r\n（4）审稿人：4',
  `flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '任务状态，包含2种：\r\n（1）未完成：0\r\n（2）已完成：1',
  `date` datetime NOT NULL COMMENT '该记录产生的时间',
  PRIMARY KEY (`id`),
  KEY `FK_tasks_articles` (`id_article`),
  KEY `FK_tasks_type_role` (`role`),
  CONSTRAINT `FK_tasks_articles` FOREIGN KEY (`id_article`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_tasks_type_role` FOREIGN KEY (`role`) REFERENCES `type_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.tasks 的数据：~4 rows (大约)
DELETE FROM `tasks`;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` (`id`, `id_article`, `id_role`, `content`, `stat`, `role`, `flag`, `date`) VALUES
	(1, 1, 1, NULL, 0, 2, 1, '2018-05-03 10:30:32'),
	(2, 2, 1, NULL, 0, 2, 1, '2018-05-03 10:36:49'),
	(3, 2, 1, '', 7, 4, 0, '2018-05-11 10:55:36'),
	(4, 1, 1, '', 1, 4, 0, '2018-05-11 10:29:58');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;

-- 导出  表 newsroom.test 结构
CREATE TABLE IF NOT EXISTS `test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.test 的数据：~0 rows (大约)
DELETE FROM `test`;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;

-- 导出  表 newsroom.type_academicsec 结构
CREATE TABLE IF NOT EXISTS `type_academicsec` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academicsec` varchar(255) NOT NULL COMMENT '学术领域',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.type_academicsec 的数据：~5 rows (大约)
DELETE FROM `type_academicsec`;
/*!40000 ALTER TABLE `type_academicsec` DISABLE KEYS */;
INSERT INTO `type_academicsec` (`id`, `academicsec`) VALUES
	(1, '临床医学'),
	(2, '麻醉学'),
	(3, '医学影像学'),
	(4, '口腔医学'),
	(5, '其他');
/*!40000 ALTER TABLE `type_academicsec` ENABLE KEYS */;

-- 导出  表 newsroom.type_column 结构
CREATE TABLE IF NOT EXISTS `type_column` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `column` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='期刊栏目';

-- 正在导出表  newsroom.type_column 的数据：~3 rows (大约)
DELETE FROM `type_column`;
/*!40000 ALTER TABLE `type_column` DISABLE KEYS */;
INSERT INTO `type_column` (`id`, `column`) VALUES
	(1, '综述'),
	(2, '医学'),
	(3, '其他');
/*!40000 ALTER TABLE `type_column` ENABLE KEYS */;

-- 导出  表 newsroom.type_education 结构
CREATE TABLE IF NOT EXISTS `type_education` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `education` varchar(255) NOT NULL COMMENT '学历',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.type_education 的数据：~7 rows (大约)
DELETE FROM `type_education`;
/*!40000 ALTER TABLE `type_education` DISABLE KEYS */;
INSERT INTO `type_education` (`id`, `education`) VALUES
	(1, '高中生'),
	(2, '本科生'),
	(3, '研究生'),
	(4, '讲师'),
	(5, '副教授'),
	(6, '教授'),
	(7, '其他');
/*!40000 ALTER TABLE `type_education` ENABLE KEYS */;

-- 导出  表 newsroom.type_location 结构
CREATE TABLE IF NOT EXISTS `type_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL COMMENT '国家/地区',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.type_location 的数据：~1 rows (大约)
DELETE FROM `type_location`;
/*!40000 ALTER TABLE `type_location` DISABLE KEYS */;
INSERT INTO `type_location` (`id`, `location`) VALUES
	(1, '中国');
/*!40000 ALTER TABLE `type_location` ENABLE KEYS */;

-- 导出  表 newsroom.type_major 结构
CREATE TABLE IF NOT EXISTS `type_major` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `major` varchar(255) NOT NULL COMMENT '专业',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.type_major 的数据：~2 rows (大约)
DELETE FROM `type_major`;
/*!40000 ALTER TABLE `type_major` DISABLE KEYS */;
INSERT INTO `type_major` (`id`, `major`) VALUES
	(1, '临床医学'),
	(2, '其他');
/*!40000 ALTER TABLE `type_major` ENABLE KEYS */;

-- 导出  表 newsroom.type_role 结构
CREATE TABLE IF NOT EXISTS `type_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roletable` varchar(255) DEFAULT NULL COMMENT '角色表名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- 正在导出表  newsroom.type_role 的数据：~4 rows (大约)
DELETE FROM `type_role`;
/*!40000 ALTER TABLE `type_role` DISABLE KEYS */;
INSERT INTO `type_role` (`id`, `roletable`) VALUES
	(1, 'authors'),
	(2, 'editors'),
	(3, 'editors'),
	(4, 'professors');
/*!40000 ALTER TABLE `type_role` ENABLE KEYS */;

-- 导出  过程 newsroom.upateprofessor 结构
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `upateprofessor`()
BEGIN
DECLARE i int;
set i=1;
WHILE i<50008 do
UPDATE `newsroom`.`professors` SET alive=1;

SET i=i+1; 
END 
WHILE;

END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
