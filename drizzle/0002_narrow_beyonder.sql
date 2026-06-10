ALTER TABLE `students` DROP INDEX `students_sequentialNumber_unique`;--> statement-breakpoint
ALTER TABLE `students` DROP INDEX `students_nationalNumber_unique`;--> statement-breakpoint
ALTER TABLE `students` ADD `isDuplicate` int DEFAULT 0 NOT NULL;