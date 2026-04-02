CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`coverImage` varchar(500),
	`category` enum('market_insights','area_guide','buying_tips','selling_tips','investment','news') NOT NULL DEFAULT 'news',
	`tags` text,
	`author` varchar(100) DEFAULT 'YoungProp Team',
	`published` boolean DEFAULT false,
	`publishedAt` timestamp,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`message` text,
	`propertyId` int,
	`propertyTitle` varchar(255),
	`leadType` enum('inquiry','valuation','contact','wishlist') NOT NULL DEFAULT 'inquiry',
	`status` enum('new','contacted','qualified','closed') NOT NULL DEFAULT 'new',
	`source` varchar(50) DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`propertyType` enum('vacant_land','plot','house','apartment','commercial') NOT NULL,
	`status` enum('for_sale','for_rent','sold','rented') NOT NULL DEFAULT 'for_sale',
	`price` decimal(15,2) NOT NULL,
	`size` decimal(10,2),
	`sizeUnit` varchar(10) DEFAULT 'm2',
	`bedrooms` int,
	`bathrooms` int,
	`garages` int,
	`address` varchar(500),
	`suburb` varchar(100),
	`city` varchar(100),
	`province` varchar(100),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`images` text,
	`featured` boolean DEFAULT false,
	`isNew` boolean DEFAULT true,
	`agentName` varchar(100),
	`agentPhone` varchar(20),
	`agentEmail` varchar(320),
	`webRef` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(100) NOT NULL,
	`clientLocation` varchar(100),
	`clientPhoto` varchar(500),
	`rating` int NOT NULL DEFAULT 5,
	`review` text NOT NULL,
	`propertyType` varchar(50),
	`featured` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `valuations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` varchar(500) NOT NULL,
	`suburb` varchar(100),
	`city` varchar(100),
	`propertyType` varchar(50),
	`size` varchar(50),
	`notes` text,
	`status` enum('pending','scheduled','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `valuations_id` PRIMARY KEY(`id`)
);
