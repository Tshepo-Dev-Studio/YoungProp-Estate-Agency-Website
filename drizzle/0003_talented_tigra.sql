CREATE TABLE `referral_partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(100) NOT NULL,
	`phone` varchar(20),
	`email` varchar(320),
	`idNumber` varchar(20),
	`bankDetails` text,
	`referralSource` varchar(100),
	`status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
	`totalReferrals` int DEFAULT 0,
	`totalEarnings` decimal(15,2) DEFAULT '0.00',
	`totalPaid` decimal(15,2) DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referral_partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_partners_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `deals` ADD `commissionPaid` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `deals` ADD `referralPartnerId` int;--> statement-breakpoint
ALTER TABLE `deals` ADD `referralFeeAmount` decimal(15,2);--> statement-breakpoint
ALTER TABLE `deals` ADD `referralFeePaid` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `deals` ADD `showPriceToReferrer` boolean DEFAULT false;