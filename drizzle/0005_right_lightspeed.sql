CREATE TABLE `company_news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` enum('announcement','policy','training','achievement','market_update','general') NOT NULL DEFAULT 'general',
	`pinned` boolean DEFAULT false,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `company_news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compliance_docs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int,
	`docType` varchar(100) NOT NULL,
	`docName` varchar(255) NOT NULL,
	`fileUrl` varchar(1000),
	`issueDate` timestamp,
	`expiryDate` timestamp,
	`status` enum('valid','expiring_soon','expired','pending') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `compliance_docs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`noteType` enum('intro_inquiry','transcript_log','transcript_summary','custom_notes') NOT NULL,
	`noteContent` text NOT NULL,
	`author` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_stage_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`fromStage` varchar(100),
	`toStage` varchar(100) NOT NULL,
	`changedBy` int,
	`notes` text,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_stage_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`assignedAgentId` int,
	`assistantAgentId` int,
	`assignedAdminId` int,
	`firstName` varchar(100),
	`surname` varchar(100),
	`fullName` varchar(200) NOT NULL,
	`phone` varchar(20),
	`mobile` varchar(20),
	`email` varchar(320),
	`idNumber` varchar(20),
	`contactType` enum('buyer','seller','tenant','landlord') NOT NULL,
	`currentStage` varchar(100) NOT NULL DEFAULT 'General',
	`source` varchar(100),
	`leadDate` timestamp,
	`lastContactedDate` timestamp,
	`popiaConsent` boolean DEFAULT false,
	`popiaConsentDate` timestamp,
	`budget` varchar(100),
	`preApproval` enum('yes','no','in_progress'),
	`areaOfInterest` varchar(255),
	`requirements` text,
	`propertyAddress` varchar(500),
	`estimatedValue` varchar(100),
	`mandateType` enum('sole','open','joint_sole'),
	`initialNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deed_search_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`searchQuery` varchar(500) NOT NULL,
	`area` varchar(200),
	`ownerName` varchar(200),
	`erfNumber` varchar(100),
	`titleDeedNumber` varchar(100),
	`propertyAddress` varchar(500),
	`estimatedValue` decimal(15,2),
	`notes` text,
	`contactedOwner` boolean DEFAULT false,
	`contactedDate` timestamp,
	`outcome` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deed_search_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` varchar(255) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'ZAR',
	`receiptUrl` varchar(1000),
	`expenseDate` timestamp NOT NULL,
	`approved` boolean DEFAULT false,
	`approvedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `full_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` int NOT NULL,
	`contactId` int,
	`refNo` varchar(50),
	`address` varchar(500) NOT NULL,
	`suburb` varchar(100),
	`city` varchar(100),
	`province` varchar(100),
	`propertyType` enum('house','apartment','townhouse','vacant_land','commercial','farm') NOT NULL,
	`listingType` enum('for_sale','for_rent') NOT NULL DEFAULT 'for_sale',
	`sellerName` varchar(100),
	`sellerPhone` varchar(20),
	`sellerEmail` varchar(320),
	`askingPrice` decimal(15,2),
	`priceReduced` boolean DEFAULT false,
	`mandateType` enum('sole','open','joint_sole'),
	`mandateStartDate` timestamp,
	`mandateExpiry` timestamp,
	`bedrooms` int,
	`bathrooms` int,
	`garages` int,
	`size` decimal(10,2),
	`erfSize` decimal(10,2),
	`description` text,
	`features` text,
	`images` text,
	`floorPlan` varchar(500),
	`virtualTour` varchar(500),
	`status` enum('draft','active','under_offer','sold','rented','withdrawn','expired') NOT NULL DEFAULT 'draft',
	`listedAt` timestamp,
	`soldAt` timestamp,
	`publishToProperty24` boolean DEFAULT false,
	`publishToPrivateProperty` boolean DEFAULT false,
	`publishToWebsite` boolean DEFAULT true,
	`sourceUrl` varchar(1000),
	`consentRecorded` boolean DEFAULT false,
	`consentType` enum('verbal','written'),
	`consentNotes` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `full_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`goalType` enum('revenue','deals','listings','leads','commission','custom') NOT NULL,
	`targetValue` decimal(15,2) NOT NULL,
	`currentValue` decimal(15,2) DEFAULT '0.00',
	`unit` varchar(50) DEFAULT 'ZAR',
	`period` enum('monthly','quarterly','annual') NOT NULL DEFAULT 'monthly',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`status` enum('active','achieved','missed','cancelled') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','agent','intern','ceo') NOT NULL DEFAULT 'user';