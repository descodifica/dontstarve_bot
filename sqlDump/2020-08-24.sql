DROP TABLE IF EXISTS `characters`;

CREATE TABLE `characters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `health` int(11) NOT NULL,
  `max_health` int(11) DEFAULT NULL,
  `hunger` int(11) NOT NULL,
  `max_hunger` int(11) DEFAULT NULL,
  `sanity` int(11) NOT NULL,
  `max_sanity` int(11) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `favorite_food` varchar(50) DEFAULT NULL,
  `history` text,
  `description` text,
  PRIMARY KEY (`id`)
)

INSERT INTO `characters` VALUES (1,'Wilson',150,NULL,150,NULL,200,NULL,'0000-00-00',NULL,NULL,NULL),(2,'Willow',150,NULL,150,NULL,120,NULL,'0000-00-00',NULL,NULL,NULL),(3,'Wolfgang',150,300,300,NULL,200,NULL,'0000-00-00',NULL,NULL,NULL),(4,'Wendy',150,NULL,150,NULL,200,NULL,'0000-00-00',NULL,NULL,NULL),(5,'WX-78',100,400,100,200,100,300,NULL,NULL,NULL,NULL),(6,'Wickerbottom',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(7,'Woodie',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(8,'Wes',113,NULL,113,NULL,150,NULL,NULL,NULL,NULL,NULL),(9,'Maxwell',75,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(10,'Wigfrid',200,NULL,120,NULL,120,NULL,NULL,NULL,NULL,NULL),(11,'Webber',175,NULL,175,NULL,100,NULL,NULL,NULL,NULL,NULL),(12,'Winona',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(13,'Wortox',200,NULL,175,NULL,150,NULL,NULL,NULL,NULL,NULL),(14,'Wormwood',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(15,'Warly',150,NULL,250,NULL,200,NULL,NULL,NULL,NULL,NULL),(16,'Wagstaff',150,NULL,225,NULL,150,NULL,NULL,NULL,NULL,NULL),(17,'Walani',120,NULL,200,NULL,200,NULL,NULL,NULL,NULL,NULL),(18,'Wilbur',125,NULL,175,NULL,150,NULL,NULL,NULL,NULL,NULL),(19,'Woodlegs',150,NULL,150,NULL,120,NULL,NULL,NULL,NULL,NULL),(20,'Wilba',150,NULL,200,NULL,100,NULL,NULL,NULL,NULL,NULL),(21,'Wheeler',100,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(22,'Wurt',150,250,200,250,150,200,NULL,NULL,NULL,NULL),(23,'Walter',130,NULL,110,NULL,200,NULL,NULL,NULL,NULL,NULL);

DROP TABLE IF EXISTS `configs`;

CREATE TABLE `configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lang` enum('de','en','es','fr','it','ptbr','zhcn') NOT NULL DEFAULT 'ptbr',
  `server_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
)

DROP TABLE IF EXISTS `profiles`;

CREATE TABLE `profiles` (
  `id` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `nick` varchar(50) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `genre` enum('0','1') DEFAULT NULL,
  PRIMARY KEY (`id`)
)

DROP TABLE IF EXISTS `experiences`;

CREATE TABLE `experiences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) NOT NULL,
  `version` enum('DS','SW','HAM','DST') NOT NULL,
  `have` enum('0','1') DEFAULT NULL,
  `platform` enum('Steam','PS','Xbox','Android','Iphone') DEFAULT NULL,
  `hours` int(11) DEFAULT NULL,
  `main` int(11) DEFAULT NULL,
  `survived` int(11) DEFAULT NULL,
  `level` enum('abducted','hungry','explorer','survivor','backpacker','constantian','charliesFriend','kingOfConstant','allyOfThem') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `experience_fk_1` (`main`),
  KEY `experiences_fk` (`user`),
  CONSTRAINT `experience_fk_1` FOREIGN KEY (`main`) REFERENCES `characters` (`id`),
  CONSTRAINT `experiences_fk` FOREIGN KEY (`user`) REFERENCES `profiles` (`id`)
)