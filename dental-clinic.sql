-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: dental_clinic
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointmentID` int NOT NULL AUTO_INCREMENT,
  `ordinationID` int DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Available` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`appointmentID`),
  KEY `ordinationID` (`ordinationID`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`ordinationID`) REFERENCES `ordination` (`ordinationID`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (4,15,'2024-09-09','13:30:00','14:00:00',0),(10,15,'2024-09-09','08:00:00','09:00:00',1),(13,15,'2024-09-16','13:00:00','13:30:00',1),(14,15,'2024-09-17','08:00:00','09:00:00',1),(15,17,'2024-09-25','09:00:00','09:30:00',1),(16,17,'2024-09-25','09:30:00','10:00:00',1),(17,17,'2024-09-25','10:00:00','11:00:00',1),(18,17,'2024-09-25','12:00:00','12:30:00',1),(19,17,'2024-09-25','12:30:00','13:00:00',1),(20,17,'2024-09-25','15:00:00','15:30:00',1),(21,17,'2024-09-25','15:30:00','16:00:00',1),(22,17,'2024-09-25','16:00:00','17:00:00',0),(23,17,'2024-09-25','17:00:00','17:30:00',1);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dentalrecord`
--

DROP TABLE IF EXISTS `dentalrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dentalrecord` (
  `dentalRecordID` int NOT NULL AUTO_INCREMENT,
  `number` varchar(10) NOT NULL,
  `patientID` int NOT NULL,
  `ordinationID` int NOT NULL,
  `visitDate` date NOT NULL,
  `examination` text,
  `recipe` text,
  `addition` text,
  PRIMARY KEY (`dentalRecordID`),
  UNIQUE KEY `number` (`number`),
  KEY `patientID` (`patientID`),
  KEY `ordinationID` (`ordinationID`),
  CONSTRAINT `dentalrecord_ibfk_1` FOREIGN KEY (`patientID`) REFERENCES `user` (`userID`),
  CONSTRAINT `dentalrecord_ibfk_2` FOREIGN KEY (`ordinationID`) REFERENCES `ordination` (`ordinationID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dentalrecord`
--

LOCK TABLES `dentalrecord` WRITE;
/*!40000 ALTER TABLE `dentalrecord` DISABLE KEYS */;
INSERT INTO `dentalrecord` VALUES (5,'5157',27,15,'2024-09-22','string','string','string'),(6,'80118',30,17,'2024-09-24','Pregled.','Izbjegavati hladne napitke.','Kontrola za sedmicu dana.');
/*!40000 ALTER TABLE `dentalrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `locationID` int NOT NULL AUTO_INCREMENT,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `locationName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`locationID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,0.00000000,0.00000000,'string','string'),(2,44.20195900,17.92163890,'Crkvice 42 Zenica',NULL),(3,44.06595690,17.93917360,'Kaćuni bb',NULL),(4,52.19612460,-8.39395910,'string',NULL),(5,44.20062170,17.90968390,'Bulevar Kulina bana 31, Zenica 72000',NULL),(6,41.05940000,42.73190000,'SPO \"Stadion Tušanj\", Tuzla 75000',NULL);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordination`
--

DROP TABLE IF EXISTS `ordination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordination` (
  `ordinationID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `locationID` int DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `owner` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ordinationID`),
  KEY `locationID` (`locationID`),
  KEY `owner` (`owner`),
  CONSTRAINT `ordination_ibfk_1` FOREIGN KEY (`locationID`) REFERENCES `location` (`locationID`),
  CONSTRAINT `ordination_ibfk_2` FOREIGN KEY (`owner`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordination`
--

LOCK TABLES `ordination` WRITE;
/*!40000 ALTER TABLE `ordination` DISABLE KEYS */;
INSERT INTO `ordination` VALUES (9,'Medinina ordinacija',2,'123456789',26,'Crkvice 42 Zenica'),(15,'Stomatološka ordinacija Meldent',5,'062 755 142',25,'Bulevar Kulina bana 31, Zenica 72000'),(16,'Test',3,'123456789',26,'Kaćuni bb, 72264'),(17,'Stomatološka ordinacija \"Dr. Mazalović\"',6,'035 961-671',29,'SPO \"Stadion Tušanj\", Tuzla 75000');
/*!40000 ALTER TABLE `ordination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `reservationID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `appointmentID` int DEFAULT NULL,
  `reservationDate` datetime DEFAULT NULL,
  `status` enum('na cekanju','odobrena','odbijena') DEFAULT 'na cekanju',
  `description` text,
  `age` int DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`reservationID`),
  KEY `userID` (`userID`),
  KEY `appointmentID` (`appointmentID`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`appointmentID`) REFERENCES `appointment` (`appointmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (2,27,13,'2024-09-17 10:38:00','odobrena','pregled',18,'123456789'),(8,30,22,'2024-09-24 00:15:47','odobrena','Pregled',18,'123456788');
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `role` enum('pacijent','doktor','admin') DEFAULT 'pacijent',
  PRIMARY KEY (`userID`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (24,'Medina','Ferhatović','medina@gmail.com','h1NYcF5nj/bmZ2rFvLV7Om+aiVzX+0y1pPsVKSkEEvw=','admin'),(25,'Doktor','Jedan','doktor@gmail.com','PlnLJ8cYuipYrnjpLSonrFo3WoWeWqV/Ufhqi7ven+I=','doktor'),(26,'user','user','user@gmail.com','gxwjeSjmISvtqkRRpRSs4xdFYvZ2H2oVei/lCCs24vs=','doktor'),(27,'neko','neko','neko@gmail.com','kFhn0RWY0lbbV0P3U3tRJj7Xic8o/iU9YKQmu/yOOpk=','pacijent'),(29,'Doktor ','Dva','doktor2@gmail.com','aTFIChE2pxvgE/HlWg/yXt1hjezewGC8GdptGoolbd4=','doktor'),(30,'Rijad','Ferhatović','rijad@gmail.com','1E1Bl43JXennTnU4yZX7pZHp5N0h0vHBqKab0iPz46Y=','pacijent');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit`
--

DROP TABLE IF EXISTS `visit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit` (
  `VisitId` int NOT NULL AUTO_INCREMENT,
  `VisitDate` datetime DEFAULT NULL,
  `Examination` text,
  `Recipe` text,
  `Addition` text,
  `dentalRecordID` int NOT NULL,
  PRIMARY KEY (`VisitId`),
  KEY `dentalRecordID` (`dentalRecordID`),
  CONSTRAINT `visit_ibfk_1` FOREIGN KEY (`dentalRecordID`) REFERENCES `dentalrecord` (`dentalRecordID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit`
--

LOCK TABLES `visit` WRITE;
/*!40000 ALTER TABLE `visit` DISABLE KEYS */;
INSERT INTO `visit` VALUES (3,'2024-09-25 00:00:00','Pregled broj 2.','Terapija 2.','Kontrola za sedmicu dana.',6);
/*!40000 ALTER TABLE `visit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-24  1:20:41
