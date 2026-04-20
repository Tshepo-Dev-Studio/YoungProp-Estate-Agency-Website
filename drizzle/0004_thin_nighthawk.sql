CREATE TABLE `agent_invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('admin','agent','intern') NOT NULL DEFAULT 'agent',
	`invitedBy` int NOT NULL,
	`used` boolean NOT NULL DEFAULT false,
	`usedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `agent_invites_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `referral_access_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(128) NOT NULL,
	`partnerId` int NOT NULL,
	`partnerName` varchar(100) NOT NULL,
	`partnerEmail` varchar(320),
	`active` boolean NOT NULL DEFAULT true,
	`lastAccessedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referral_access_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `referral_access_tokens_token_unique` UNIQUE(`token`)
);
