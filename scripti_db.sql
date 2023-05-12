CREATE DATABASE  IF NOT EXISTS `scripti_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `scripti_db`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: scripti_db
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `details` varchar(1000) DEFAULT NULL,
  `deadline` date NOT NULL,
  `status` enum('нове','виконується','зроблено','оцінено') NOT NULL DEFAULT 'нове',
  `course_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_assignments_courses` (`course_id`),
  CONSTRAINT `fk_assignments_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (4,'Курсова робота','Написати курсову роботу на тему: \"Особливий режим досудового розслідування в умовах воєнного стану\"','2023-04-01','зроблено',4),(31,'Лабораторна робота 13','Створити список суміжності для заданого графа та побудувати граф за списком суміжності','2023-03-13','зроблено',7),(32,'Лабораторна робота 4','Створити гугл-форму для вивчення підходів моделі Кано','2023-05-08','нове',3),(35,'Лабораторна робота 15','Виконати лабораторну роботу та надіслати резцльтат виконання викладачеві у телеграм','2023-05-09','зроблено',9),(40,'Лабораторна робота 1',NULL,'2023-04-03','оцінено',1),(41,'Лабораторна робота 2',NULL,'2023-04-03','оцінено',1),(42,'Лабораторна робота 3',NULL,'2023-04-03','оцінено',1),(43,'Лабораторна робота 4',NULL,'2023-04-03','оцінено',1),(44,'Лабораторна робота 5',NULL,'2023-04-03','оцінено',1),(45,'Лабораторна робота 6',NULL,'2023-04-03','оцінено',1),(46,'Лабоарторна робота 1',NULL,'2023-04-03','оцінено',3),(47,'Лабораторна робота 2',NULL,'2023-04-03','оцінено',3),(48,'Лабораторна робота 3',NULL,'2023-04-03','оцінено',3),(49,'Writing',NULL,'2023-04-03','оцінено',8),(50,'Writing',NULL,'2023-04-03','оцінено',8),(51,'Writing',NULL,'2023-04-03','оцінено',8),(52,'Writing',NULL,'2023-04-03','оцінено',8),(53,'Writing',NULL,'2023-04-03','оцінено',8),(54,'Лабораторна робота 1',NULL,'2023-04-03','оцінено',9),(55,'Лабораторна робота 2',NULL,'2023-04-03','оцінено',9),(56,'Лабораторна робота 3',NULL,'2023-04-03','оцінено',9),(57,'Лабораторна робота 4',NULL,'2023-04-03','оцінено',9),(58,'Лабораторна робота 1',NULL,'2023-04-03','оцінено',11),(59,'Лабораторна робота 2',NULL,'2023-04-03','оцінено',11),(60,'Лабораторна робота 3',NULL,'2023-04-03','оцінено',11);
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_title` varchar(500) NOT NULL,
  `teacher` varchar(500) NOT NULL,
  `assistant` varchar(500) NOT NULL,
  `form_of_final_control` varchar(255) NOT NULL,
  `course_notes` text,
  `conference_link` varchar(255) DEFAULT NULL,
  `schedule_id` int NOT NULL,
  PRIMARY KEY (`course_id`),
  KEY `fk_courses_schedule` (`schedule_id`),
  CONSTRAINT `fk_courses_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'PHP','Дика А. І.','Дика А. І.','залік',NULL,NULL,1),(2,'ООП','Рудніченко М. Д.','Рудніченко М. Д.','іспит, захист КР',NULL,NULL,1),(3,'АВПЗ','Манаков С. Ю.','Манаков С. Ю.','іспит',NULL,NULL,1),(4,'КПП','Аленін Ю. П.','Аленін Ю. П.','іспит. захист КР',NULL,'https://us05web.zoom.us/j/84067286591?pwd=eHVpc2ZzeGNxTVFkY2NsQm1Qb2R2Zz09',2),(5,'Кримінологія','Цитряк В. Я','Цитряк В. Я','іспит',NULL,'https://us04web.zoom.us/j/76886603140?pwd=ANLQ3Yta11HbhCf0cYrEHn9LNbFfQR.1',2),(6,'ЦПП','Іліопол І. М.','Іліопол І. М.','іспит',NULL,'https://us04web.zoom.us/j/72824638722?pwd=oaVKtmbkQ9lPcmGKCYDuuIXPrafpT7.1',2),(7,'АСД','Трофименко О. Г.','Трофименко О. Г.','іспит',NULL,NULL,1),(8,'Англ.проф','Ковальова К.','Ковальова К.','залік','','',1),(9,'Веб','Манаков С. Ю,','Манаков С. Ю,','іспит','','',1),(10,'Англ','Лесневська К. В.','Лесневська К. В.','залік','','',1),(11,'Бази даних','Логінова Н. І,','Логінова Н. І,','залік','','',1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses_per_day`
--

DROP TABLE IF EXISTS `courses_per_day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses_per_day` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_id` int NOT NULL,
  `course_id` int NOT NULL,
  `start_time` time DEFAULT NULL,
  `cabinet` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_courses_per_day_days` (`day_id`),
  KEY `fk_courses_per_day_courses` (`course_id`),
  CONSTRAINT `fk_courses_per_day_courses` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  CONSTRAINT `fk_courses_per_day_days` FOREIGN KEY (`day_id`) REFERENCES `days` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses_per_day`
--

LOCK TABLES `courses_per_day` WRITE;
/*!40000 ALTER TABLE `courses_per_day` DISABLE KEYS */;
INSERT INTO `courses_per_day` VALUES (1,1,1,'10:00:00',204),(2,1,1,'11:50:00',204),(3,1,2,'13:20:00',203),(4,1,3,'14:45:00',202),(5,2,4,'11:50:00',NULL),(6,2,5,'13:20:00',NULL),(7,2,4,'14:45:00',NULL),(8,2,6,'16:15:00',NULL),(9,2,6,'17:45:00',NULL),(16,69,3,'11:50:00',203),(17,69,2,'13:20:00',NULL),(18,69,8,'14:45:00',801),(19,69,1,'16:15:00',204),(20,70,11,'11:50:00',303),(21,70,7,'13:20:00',305),(22,70,7,'14:45:00',305),(23,70,9,'16:15:00',202),(24,71,11,'13:20:00',303),(25,71,7,'14:45:00',305),(26,71,10,'16:15:00',202),(27,72,11,'10:00:00',303),(28,72,1,'11:50:00',204),(29,72,9,'13:20:00',202),(30,73,9,'11:50:00',202),(31,73,11,'13:20:00',303),(32,73,11,'14:45:00',303),(33,74,4,'11:50:00',NULL),(34,74,4,'13:20:00',NULL),(35,74,5,'14:45:00',NULL),(36,74,6,'16:15:00',NULL),(37,75,6,'11:50:00',NULL),(38,75,4,'13:20:00',NULL),(39,75,4,'14:45:00',NULL),(40,76,5,'11:50:00',NULL),(41,76,5,'13:20:00',NULL),(42,76,6,'14:45:00',NULL),(43,76,4,'16:15:00',NULL),(44,77,6,'11:50:00',NULL),(45,77,6,'13:20:00',NULL),(46,77,5,'14:45:00',NULL),(47,77,4,'16:15:00',NULL),(48,78,4,'11:50:00',NULL),(49,78,5,'13:20:00',NULL),(50,78,5,'14:45:00',NULL),(51,78,6,'16:15:00',NULL),(52,79,3,'11:50:00',203),(53,79,2,'13:20:00',NULL),(54,79,8,'14:45:00',801),(55,79,1,'16:15:00',204),(56,80,3,'11:50:00',202),(57,80,7,'13:20:00',305),(58,80,7,'14:45:00',305),(59,80,9,'16:15:00',202),(60,80,2,'17:45:00',NULL),(61,81,10,'13:20:00',705),(62,81,7,'14:45:00',305),(63,82,11,'10:00:00',303),(64,82,1,'11:50:00',204),(65,82,9,'13:20:00',202),(66,83,9,'11:50:00',202),(67,83,10,'13:20:00',501),(68,83,11,'14:45:00',303),(86,84,4,'11:50:00',NULL),(87,84,4,'13:20:00',NULL),(88,84,5,'14:45:00',NULL),(89,84,6,'16:15:00',NULL),(90,85,5,'11:50:00',NULL),(91,85,5,'13:20:00',NULL),(92,85,4,'14:45:00',NULL),(93,86,6,'11:50:00',NULL),(94,86,4,'14:45:00',NULL),(95,86,5,'16:15:00',NULL),(96,87,5,'11:50:00',NULL),(97,87,4,'13:20:00',NULL),(98,87,6,'14:45:00',NULL),(99,87,6,'16:15:00',NULL),(100,88,4,'11:50:00',NULL),(101,88,4,'13:20:00',NULL),(102,88,5,'14:45:00',NULL);
/*!40000 ALTER TABLE `courses_per_day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `days`
--

DROP TABLE IF EXISTS `days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schedule_id` int NOT NULL,
  `day_of_week` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `days`
--

LOCK TABLES `days` WRITE;
/*!40000 ALTER TABLE `days` DISABLE KEYS */;
INSERT INTO `days` VALUES (1,1,1),(2,2,1),(69,50,1),(70,50,2),(71,50,3),(72,50,4),(73,50,5),(74,51,1),(75,51,2),(76,51,3),(77,51,4),(78,51,5),(79,52,1),(80,52,2),(81,52,3),(82,52,4),(83,52,5),(84,53,1),(85,53,2),(86,53,3),(87,53,4),(88,53,5);
/*!40000 ALTER TABLE `days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grade` int NOT NULL,
  `assignment_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grades_assignments` (`assignment_id`),
  CONSTRAINT `fk_grades_assignments` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (1,5,4),(2,5,31),(3,5,40),(4,5,41),(5,5,42),(6,5,43),(7,5,44),(8,5,45),(9,5,46),(10,5,47),(11,5,48),(12,5,49),(13,5,50),(14,5,51),(15,5,52),(16,5,53),(17,5,54),(18,5,55),(19,5,56),(20,5,57),(21,5,58),(22,5,59),(23,5,60);
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `schedule_name` varchar(500) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,'121 Інженерія програмного забезпечення','2003-04-20','2010-04-20'),(2,1,'081 Право','2003-04-20','2010-04-20'),(50,1,'121 Інженерія програмного забезпечення','2023-05-01','2023-05-05'),(51,1,'081 Право','2023-05-01','2023-05-05'),(52,1,'121 Інженерія програмного забезпечення','2023-05-08','2023-05-12'),(53,1,'081 Право','2023-05-08','2023-05-12');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  UNIQUE KEY `user_email_UNIQUE` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','testuser@example.com','password'),(23,'user','str@qa.com','12345');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-09 21:58:47
