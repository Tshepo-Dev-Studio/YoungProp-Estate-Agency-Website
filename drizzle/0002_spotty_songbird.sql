CREATE TABLE `activity_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(100) NOT NULL,
	`phone` varchar(20),
	`agentType` enum('full_time','part_time','referral_partner','intern') NOT NULL DEFAULT 'full_time',
	`status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
	`ffcNumber` varchar(50),
	`bio` text,
	`profilePhoto` varchar(500),
	`targetMonthly` decimal(15,2),
	`commissionRate` decimal(5,2) DEFAULT '50.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `agent_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`propertyId` int,
	`propertyTitle` varchar(255) NOT NULL,
	`propertyAddress` varchar(500),
	`dealType` enum('sale','rental','valuation','referral') NOT NULL DEFAULT 'sale',
	`stage` enum('lead','viewing_scheduled','offer_made','offer_accepted','conveyancing','transfer','closed_won','closed_lost') NOT NULL DEFAULT 'lead',
	`clientName` varchar(100) NOT NULL,
	`clientEmail` varchar(320),
	`clientPhone` varchar(20),
	`askingPrice` decimal(15,2),
	`offerPrice` decimal(15,2),
	`commissionAmount` decimal(15,2),
	`notes` text,
	`expectedCloseDate` timestamp,
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`dealId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('todo','in_progress','done','cancelled') NOT NULL DEFAULT 'todo',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
