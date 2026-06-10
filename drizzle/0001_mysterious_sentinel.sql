CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sequentialNumber` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`dateOfBirth` varchar(20) NOT NULL,
	`qualification` varchar(255) NOT NULL,
	`graduationYear` int NOT NULL,
	`university` varchar(255) NOT NULL,
	`notes` text,
	`deficiencies` text,
	`status` enum('مستوفى','غير مستوفى') NOT NULL,
	`nationalNumber` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_sequentialNumber_unique` UNIQUE(`sequentialNumber`),
	CONSTRAINT `students_nationalNumber_unique` UNIQUE(`nationalNumber`)
);
