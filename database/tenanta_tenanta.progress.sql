-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: tenanta
-- ------------------------------------------------------
-- Server version	8.0.40

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
  `Quiz` int NOT NULL,
  `FillBlanks` int NOT NULL,
  `TrueFalse` int NOT NULL,
  `school` int NOT NULL,
  `standard` int NOT NULL,
  `student` int NOT NULL,
  `subject` int NOT NULL,
  `lesson` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `school` (`school`),
  KEY `standard` (`standard`),
  KEY `student` (`student`),
  KEY `subject` (`subject`),
  KEY `lesson` (`lesson`),
  CONSTRAINT `tenanta.progress_ibfk_1` FOREIGN KEY (`school`) REFERENCES `tenanta.school` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_2` FOREIGN KEY (`standard`) REFERENCES `tenanta.standard` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_3` FOREIGN KEY (`student`) REFERENCES `tenanta.student` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_4` FOREIGN KEY (`subject`) REFERENCES `tenanta.subject` (`Id`),
  CONSTRAINT `tenanta.progress_ibfk_5` FOREIGN KEY (`lesson`) REFERENCES `tenanta.lesson` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenanta.progress`
--

LOCK TABLES `tenanta.progress` WRITE;
/*!40000 ALTER TABLE `tenanta.progress` DISABLE KEYS */;
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

-- Dump completed on 2025-02-22  2:22:21
