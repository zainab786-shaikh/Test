-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: tenanta
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tenanta.progress`
--

DROP TABLE IF EXISTS `tenanta.progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenanta.progress` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `quiz` int NOT NULL,
  `fillblanks` int NOT NULL,
  `truefalse` int NOT NULL,
  `school` int NOT NULL,
  `standard` int NOT NULL,
  `student` int NOT NULL,
  `subject` int DEFAULT NULL,
  `lesson` int DEFAULT NULL,
  `lessonsection` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `school` (`school`),
  KEY `standard` (`standard`),
  KEY `student` (`student`),
  KEY `subject` (`subject`),
  KEY `lesson` (`lesson`),
  KEY `lessonsection` (`lessonsection`),
  CONSTRAINT `tenanta.progress_ibfk_1` FOREIGN KEY (`school`) REFERENCES `tenanta.school` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_2` FOREIGN KEY (`standard`) REFERENCES `tenanta.standard` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_3` FOREIGN KEY (`student`) REFERENCES `tenanta.student` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_4` FOREIGN KEY (`subject`) REFERENCES `tenanta.subject` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_5` FOREIGN KEY (`lesson`) REFERENCES `tenanta.lesson` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_6` FOREIGN KEY (`lessonsection`) REFERENCES `tenanta.lessonsection` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=262 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenanta.progress`
--

LOCK TABLES `tenanta.progress` WRITE;
/*!40000 ALTER TABLE `tenanta.progress` DISABLE KEYS */;
INSERT INTO `tenanta.progress` VALUES (138,100,100,100,1,5,14,12,4,9),(139,100,100,100,1,5,14,12,4,10),(140,0,0,0,1,5,14,12,4,11),(141,0,0,0,1,5,14,12,4,12),(142,0,0,0,1,5,14,12,4,13),(143,0,0,0,1,5,14,12,5,14),(144,0,0,0,1,5,14,12,5,15),(145,0,0,0,1,5,14,12,5,16),(146,0,0,0,1,5,14,12,5,17),(147,0,0,0,1,5,14,12,5,19),(148,0,0,0,1,5,14,12,5,20),(149,0,0,0,1,5,14,12,6,22),(150,0,0,0,1,5,14,12,6,21),(151,0,0,0,1,5,14,12,6,23),(152,0,0,0,1,5,14,12,5,18),(153,0,0,0,1,5,14,13,9,26),(154,0,0,0,1,5,14,13,9,27),(155,0,0,0,1,5,14,13,9,28),(156,0,0,0,1,5,14,13,10,29),(157,0,0,0,1,5,14,13,10,31),(158,0,0,0,1,5,14,13,11,33),(159,0,0,0,1,5,14,13,11,34),(160,0,0,0,1,5,14,13,11,36),(161,0,0,0,1,5,14,13,11,37),(162,0,0,0,1,5,14,12,6,24),(163,0,0,0,1,5,14,12,6,25),(164,0,0,0,1,5,14,13,10,30),(165,0,0,0,1,5,14,13,10,32),(166,0,0,0,1,5,14,13,11,35),(167,0,0,0,1,5,15,13,9,26),(168,0,0,0,1,5,15,13,9,27),(169,0,0,0,1,5,15,13,9,28),(170,0,0,0,1,5,15,12,4,9),(171,0,0,0,1,5,15,12,4,12),(172,0,0,0,1,5,15,12,4,13),(173,0,0,0,1,5,15,12,6,21),(174,0,0,0,1,5,15,12,6,22),(175,0,0,0,1,5,15,12,6,25),(176,0,0,0,1,5,15,12,5,14),(177,0,0,0,1,5,15,12,5,16),(178,0,0,0,1,5,15,12,4,10),(179,0,0,0,1,5,15,12,4,11),(180,0,0,0,1,5,15,12,6,23),(181,0,0,0,1,5,15,12,6,24),(182,0,0,0,1,5,15,12,5,15),(183,0,0,0,1,5,15,12,5,17),(184,0,0,0,1,5,15,12,5,18),(185,0,0,0,1,5,15,12,5,19),(186,0,0,0,1,5,15,13,10,30),(187,0,0,0,1,5,15,13,11,33),(188,0,0,0,1,5,15,13,11,34),(189,0,0,0,1,5,15,13,11,35),(190,0,0,0,1,5,15,12,5,20),(191,0,0,0,1,5,15,13,10,29),(192,0,0,0,1,5,15,13,10,31),(193,0,0,0,1,5,15,13,10,32),(194,0,0,0,1,5,15,13,11,36),(195,0,0,0,1,5,15,13,11,37),(196,0,0,0,1,6,16,14,12,38),(197,0,0,0,1,6,16,14,12,39),(198,0,0,0,1,6,16,14,12,40),(199,0,0,0,1,6,16,14,12,41),(200,0,0,0,1,6,16,14,12,42),(201,0,0,0,1,6,16,14,12,43),(202,0,0,0,1,6,16,14,13,46),(203,0,0,0,1,6,16,14,12,44),(204,0,0,0,1,6,16,14,13,51),(205,0,0,0,1,6,16,14,14,52),(206,0,0,0,1,6,16,14,14,54),(207,0,0,0,1,6,16,14,14,55),(208,0,0,0,1,6,16,14,13,47),(209,0,0,0,1,6,16,14,13,45),(210,0,0,0,1,6,16,14,13,48),(211,0,0,0,1,6,16,14,13,49),(212,0,0,0,1,6,16,14,13,50),(213,0,0,0,1,6,16,14,14,53),(214,0,0,0,1,6,16,14,14,56),(215,0,0,0,1,6,16,15,15,58),(216,0,0,0,1,6,16,15,16,62),(217,0,0,0,1,6,16,15,16,64),(218,0,0,0,1,6,16,15,16,65),(219,0,0,0,1,6,16,15,16,66),(220,0,0,0,1,6,16,15,15,57),(221,0,0,0,1,6,16,15,15,59),(222,0,0,0,1,6,16,15,15,60),(223,0,0,0,1,6,16,15,15,61),(224,0,0,0,1,6,16,15,16,63),(225,0,0,0,1,6,16,15,17,67),(226,0,0,0,1,6,16,15,17,68),(227,0,0,0,1,6,16,15,17,69),(228,0,0,0,1,6,16,15,17,70),(229,0,0,0,1,6,17,14,13,45),(230,0,0,0,1,6,17,14,13,50),(231,0,0,0,1,6,17,14,13,51),(232,0,0,0,1,6,17,14,13,46),(233,0,0,0,1,6,17,14,13,47),(234,0,0,0,1,6,17,14,13,48),(235,0,0,0,1,6,17,14,13,49),(236,0,0,0,1,6,17,15,15,57),(237,0,0,0,1,6,17,15,15,59),(238,0,0,0,1,6,17,15,15,60),(239,0,0,0,1,6,17,15,15,61),(240,0,0,0,1,6,17,15,15,58),(241,0,0,0,1,6,17,14,12,38),(242,0,0,0,1,6,17,14,12,39),(243,0,0,0,1,6,17,14,12,40),(244,0,0,0,1,6,17,14,12,41),(245,0,0,0,1,6,17,14,12,42),(246,0,0,0,1,6,17,14,14,56),(247,0,0,0,1,6,17,15,16,62),(248,0,0,0,1,6,17,15,16,65),(249,0,0,0,1,6,17,14,12,43),(250,0,0,0,1,6,17,14,12,44),(251,0,0,0,1,6,17,14,14,52),(252,0,0,0,1,6,17,14,14,53),(253,0,0,0,1,6,17,14,14,54),(254,0,0,0,1,6,17,14,14,55),(255,0,0,0,1,6,17,15,16,63),(256,0,0,0,1,6,17,15,16,64),(257,0,0,0,1,6,17,15,16,66),(258,0,0,0,1,6,17,15,17,67),(259,0,0,0,1,6,17,15,17,68),(260,0,0,0,1,6,17,15,17,69),(261,0,0,0,1,6,17,15,17,70);
/*!40000 ALTER TABLE `tenanta.progress` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-14 16:56:45
