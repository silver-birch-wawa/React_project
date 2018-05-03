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

-- 正在导出表  newsroom.announcement 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;

-- 正在导出表  newsroom.announcements 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` (`id`, `title`, `content`, `upload`, `date_pub`) VALUES
	(15, 'aaaaaaa', 'asfdghggffdsasSFSGDHFDSFAFSDGF', 'aaaaaaa附件', '2018-04-26 17:16:40'),
	(16, 'aaaaaaa', 'asfdghggffdsasSFSGDHFDSFAFSDGF', '', '2018-04-27 14:52:07');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;

-- 正在导出表  newsroom.articles 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` (`id`, `title`, `format`, `academicsec`, `column`, `keyword1_ch`, `keyword2_ch`, `keyword3_ch`, `keyword4_ch`, `keyword1_en`, `keyword2_en`, `keyword3_en`, `keyword4_en`, `summary_ch`, `summary_en`, `writer_id`, `writers_info`, `writer_prefer`, `writer_avoid`, `date_sub`, `date_pub`) VALUES
	(1, '测试', '.docx;.rar', 1, 1, '测试', NULL, NULL, NULL, 'test', NULL, NULL, NULL, '测试', 'test', 1, '', NULL, NULL, '2018-05-03 10:30:08', NULL);
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;

-- 正在导出表  newsroom.authors 的数据：~3 rows (大约)
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` (`id`, `email`, `password`, `name`, `name_pinyin`, `gender`, `address`, `postcode`, `workspace_ch`, `workspace_en`, `major`, `education`, `title`, `officetel`, `phonenum`, `location`, `researchdir`, `academicsec1`, `academicsec2`, `academicsec3`, `introduction`, `safeque1`, `safeque2`, `safeque3`, `alive`) VALUES
	(1, '11111@test.com', '12234', '测试作者一', 'ceshizuozheyi', 0, '测试1', '100000', '测试1', 'test1', 1, 3, '', '123456', '12345678900', 1, '医学', 1, 2, NULL, '测试1', '1;测试1', '2;测试1', '3;测试1', 1),
	(2, '22222@test.com', '123456', '测试作者二', 'ceshizuozheer', 0, '测试2', '100000', '测试2', 'test2', 1, 5, '', '123457', '12345678901', 1, '医学', 1, 2, 2, '测试2', '1;测试2', '2;测试2', '3;测试2', 1),
	(3, '33333@test.com', '123456', '测试作者三', 'ceshizuozhesan', 1, '测试3', '100000', '测试3', 'test', 1, 4, '', '123458', '12345678902', 1, '医学', 1, 3, 4, '测试3', '1;测试3', '2;测试3', '3;测试3', 1);
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;

-- 正在导出表  newsroom.bank_safeque 的数据：~4 rows (大约)
/*!40000 ALTER TABLE `bank_safeque` DISABLE KEYS */;
INSERT INTO `bank_safeque` (`id`, `safeque`) VALUES
	(1, '你的名字？'),
	(2, '你最喜欢的人的名字？'),
	(3, '你的曾用名？'),
	(4, '你的出生地？');
/*!40000 ALTER TABLE `bank_safeque` ENABLE KEYS */;

-- 正在导出表  newsroom.editors 的数据：~3 rows (大约)
/*!40000 ALTER TABLE `editors` DISABLE KEYS */;
INSERT INTO `editors` (`id`, `username`, `password`, `name`, `gender`, `role`, `safeque1`, `safeque2`, `safeque3`, `alive`) VALUES
	(1, 'master', '123456', '主编', 0, 0, '1;主编', '2;主编', '3;主编', 1),
	(2, 'editor1', '123456', '编辑1', 0, 1, '1;编辑1', '2;编辑1', '3;编辑1', 1),
	(3, 'editor2', '123456', '编辑2', 0, 1, '1;编辑2', '2;编辑2', '3;编辑2', 1);
/*!40000 ALTER TABLE `editors` ENABLE KEYS */;

-- 正在导出表  newsroom.invoices 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;

-- 正在导出表  newsroom.newsroominfo 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `newsroominfo` DISABLE KEYS */;
INSERT INTO `newsroominfo` (`id`, `year`, `standard`, `content`, `admin`, `password`, `reviewfee`, `pagecharges`) VALUES
	(1, 2018, 4, '{"ddl":[1522511999000,1530374399000,1538323199000,1546271999000],"num":[20,20,20,20]}', 'admin', '12345678', 60, 100);
/*!40000 ALTER TABLE `newsroominfo` ENABLE KEYS */;

-- 正在导出表  newsroom.professors 的数据：~4 rows (大约)
/*!40000 ALTER TABLE `professors` DISABLE KEYS */;
INSERT INTO `professors` (`id`, `username`, `password`, `name`, `gender`, `academicsec1`, `academicsec2`, `academicsec3`, `safeque1`, `safeque2`, `safeque3`, `alive`) VALUES
	(1, '111@qq.com', '123456', '审稿人1', 0, 1, NULL, NULL, '1;审稿人1', '2;审稿人1', '3;审稿人1', 1),
	(2, '222@qq.com', '123456', '审稿人2', 0, 1, NULL, NULL, '1;审稿人2', '2;审稿人2', '3;审稿人2', 1),
	(3, '333@qq.com', '123456', '审稿人3', 0, 1, 1, NULL, '1;审稿人3', '2;审稿人3', '3;审稿人3', 1),
	(4, '444@qq.com', '123456', '审稿人4', 0, 1, NULL, NULL, '1;审稿人4', '2;审稿人4', '3;审稿人4', 1);
/*!40000 ALTER TABLE `professors` ENABLE KEYS */;

-- 正在导出表  newsroom.tasks 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` (`id`, `id_article`, `id_role`, `content`, `stat`, `role`, `flag`, `date`) VALUES
	(1, 1, 1, NULL, 0, 2, 0, '2018-04-25 14:32:54');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;

-- 正在导出表  newsroom.test 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;

-- 正在导出表  newsroom.type_academicsec 的数据：~5 rows (大约)
/*!40000 ALTER TABLE `type_academicsec` DISABLE KEYS */;
INSERT INTO `type_academicsec` (`id`, `academicsec`) VALUES
	(1, '临床医学'),
	(2, '麻醉学'),
	(3, '医学影像学'),
	(4, '口腔医学'),
	(5, '其他');
/*!40000 ALTER TABLE `type_academicsec` ENABLE KEYS */;

-- 正在导出表  newsroom.type_column 的数据：~3 rows (大约)
/*!40000 ALTER TABLE `type_column` DISABLE KEYS */;
INSERT INTO `type_column` (`id`, `column`) VALUES
	(1, '综述'),
	(2, '医学'),
	(3, '其他');
/*!40000 ALTER TABLE `type_column` ENABLE KEYS */;

-- 正在导出表  newsroom.type_education 的数据：~7 rows (大约)
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

-- 正在导出表  newsroom.type_location 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `type_location` DISABLE KEYS */;
INSERT INTO `type_location` (`id`, `location`) VALUES
	(1, '中华人民共和国'),
	(2, '其他');
/*!40000 ALTER TABLE `type_location` ENABLE KEYS */;

-- 正在导出表  newsroom.type_major 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `type_major` DISABLE KEYS */;
INSERT INTO `type_major` (`id`, `major`) VALUES
	(1, '医学'),
	(2, '其他');
/*!40000 ALTER TABLE `type_major` ENABLE KEYS */;

-- 正在导出表  newsroom.type_role 的数据：~4 rows (大约)
/*!40000 ALTER TABLE `type_role` DISABLE KEYS */;
INSERT INTO `type_role` (`id`, `roletable`) VALUES
	(1, 'authors'),
	(2, 'editors'),
	(3, 'editors'),
	(4, 'professors');
/*!40000 ALTER TABLE `type_role` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
