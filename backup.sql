-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: directorio
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `extensiones`
--

DROP TABLE IF EXISTS `extensiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extensiones` (
  `ext` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `departamento` varchar(100) NOT NULL,
  `posicion` varchar(100) NOT NULL,
  `propiedad` varchar(10) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ext`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extensiones`
--

LOCK TABLES `extensiones` WRITE;
/*!40000 ALTER TABLE `extensiones` DISABLE KEYS */;
INSERT INTO `extensiones` VALUES (4064,'Alex Joaquín Fais','Sistemas','Asistente de Infraestructura','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4069,'Moisés Alexander Saúl','Soporte Técnico Legendary','Asistente Soporte Técnico Legendary','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4096,'Geury Alberto Díaz','Sistemas','Auxiliar de Soporte Técnico','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4097,'Ramón Alberto Paulino','Sistemas','Jefe de Soporte Técnico','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4098,'Abimael Carpio','Sistemas','Jefe de Telecomunicaciones','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4100,'Oficina Sistemas','Sistemas','---','HRPUJ','GCRUZ',0,'2025-01-09 10:36:53'),(4128,'Saturnino Disla','Sistemas','Asistente de Soporte Técnico','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4227,'Ricardo Penilas','Sistemas','Asistente de telecomunicaciones','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4262,'Elías Alberto de Jesus de la Rosa','Sistemas','Asistente de Soporte Técnico','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4372,'Emmanuel Robles','Ontour','---','HRPUJ',NULL,1,'2025-01-09 16:51:01'),(4380,'Lourdes Victoria Inmaculada Vergara','Ontour','Jefe Ontour','HRPUJ',NULL,1,'2025-01-09 16:38:03'),(4381,'Diobelysa Martínez','Ontour','Supervisora Ontour','HRPUJ',NULL,1,'2025-01-09 16:34:20'),(4390,'Booth the Ontour','Ontour','---','HRPUJ',NULL,1,'2025-01-09 17:22:32'),(4742,'Eduin José Mendoza','Sistemas','Auxiliar de Soporte Técnico','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09'),(4821,'Wellington Rodríguez','Sistemas','Auxiliar de Soporte Técnico','HRPUJ','GCRUZ',1,'2025-01-09 10:31:09');
/*!40000 ALTER TABLE `extensiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_colab` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','tectel') NOT NULL DEFAULT 'tectel',
  `activo` tinyint(1) DEFAULT '1',
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_colab`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (12345,'Test User','TEST','test@test.com','$2y$10$Q.T4uy0xFdDLpwQoVQc1vuIh0aHptofZrsb8XExDhOKTyQHHnNYli','tectel',0,'2025-01-09 10:27:58'),(98131,'German Cruz','GCRUZ','gcruz@hrhcpuntacana.com','$2y$10$tc9/uNDzs9q9BETzW9LtnO0njVa.jtIyR9UDim7oD2aXn.GzL75KO','admin',1,'2025-01-09 10:27:58');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-09 20:45:53
