-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: dontstarve_bot
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `characters`
--

DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `characters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `health` int(11) NOT NULL,
  `max_health` int(11) DEFAULT NULL,
  `hunger` int(11) NOT NULL,
  `max_hunger` int(11) DEFAULT NULL,
  `sanity` int(11) NOT NULL,
  `max_sanity` int(11) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `favorite_food` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `history` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `characters`
--

LOCK TABLES `characters` WRITE;
/*!40000 ALTER TABLE `characters` DISABLE KEYS */;
INSERT INTO `characters` VALUES (1,'Wilson',150,NULL,150,NULL,200,NULL,'0000-00-00',NULL,NULL,NULL),(2,'Willow',150,NULL,150,NULL,120,NULL,'0000-00-00',NULL,NULL,NULL),(3,'Wolfgang',150,300,300,NULL,200,NULL,'0000-00-00',NULL,NULL,NULL),(4,'Wendy',150,NULL,150,NULL,200,NULL,'0000-00-00',NULL,NULL,NULL),(5,'WX-78',100,400,100,200,100,300,NULL,NULL,NULL,NULL),(6,'Wickerbottom',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(7,'Woodie',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(8,'Wes',113,NULL,113,NULL,150,NULL,NULL,NULL,NULL,NULL),(9,'Maxwell',75,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(10,'Wigfrid',200,NULL,120,NULL,120,NULL,NULL,NULL,NULL,NULL),(11,'Webber',175,NULL,175,NULL,100,NULL,NULL,NULL,NULL,NULL),(12,'Winona',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(13,'Wortox',200,NULL,175,NULL,150,NULL,NULL,NULL,NULL,NULL),(14,'Wormwood',150,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(15,'Warly',150,NULL,250,NULL,200,NULL,NULL,NULL,NULL,NULL),(16,'Wagstaff',150,NULL,225,NULL,150,NULL,NULL,NULL,NULL,NULL),(17,'Walani',120,NULL,200,NULL,200,NULL,NULL,NULL,NULL,NULL),(18,'Wilbur',125,NULL,175,NULL,150,NULL,NULL,NULL,NULL,NULL),(19,'Woodlegs',150,NULL,150,NULL,120,NULL,NULL,NULL,NULL,NULL),(20,'Wilba',150,NULL,200,NULL,100,NULL,NULL,NULL,NULL,NULL),(21,'Wheeler',100,NULL,150,NULL,200,NULL,NULL,NULL,NULL,NULL),(22,'Wurt',150,250,200,250,150,200,NULL,NULL,NULL,NULL),(23,'Walter',130,NULL,110,NULL,200,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configs`
--

DROP TABLE IF EXISTS `configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lang` varchar(4) NOT NULL DEFAULT 'ptbr',
  `server_id` varchar(50) NOT NULL,
  `prefix` varchar(20) NOT NULL DEFAULT 'ds:',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiences`
--

DROP TABLE IF EXISTS `experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experiences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) NOT NULL,
  `version` enum('DS','SW','HAM','DST') NOT NULL,
  `have` enum('0','1') DEFAULT NULL,
  `platform` enum('Steam','PS','Xbox','Android','Iphone') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `hours` int(11) DEFAULT NULL,
  `main` int(11) DEFAULT NULL,
  `survived` int(11) DEFAULT NULL,
  `level` enum('1','2','3','4','5','6','7','8','9') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `experience_fk_1` (`main`),
  KEY `experiences_fk` (`user`),
  CONSTRAINT `experience_fk_1` FOREIGN KEY (`main`) REFERENCES `characters` (`id`),
  CONSTRAINT `experiences_fk` FOREIGN KEY (`user`) REFERENCES `profiles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiences`
--

LOCK TABLES `experiences` WRITE;
/*!40000 ALTER TABLE `experiences` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `id` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `nick` varchar(50) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dontstarve_bot'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-30 10:59:06
