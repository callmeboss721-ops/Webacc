CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`bankCode` varchar(32) NOT NULL,
	`bankName` varchar(128) NOT NULL,
	`accountNumber` varchar(64) NOT NULL,
	`accountType` varchar(64) DEFAULT 'savings',
	`pin` varchar(64),
	`phone` varchar(32),
	`lineId` varchar(128),
	`promptpay` varchar(64),
	`balance` decimal(15,2) DEFAULT '0',
	`amountDue` decimal(15,2) DEFAULT '0',
	`amountPaid` decimal(15,2) DEFAULT '0',
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`note` text,
	`avatarUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(32),
	`lineId` varchar(128),
	`note` text,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`agentId` int,
	`accountId` int,
	`type` enum('due','reimbursed') NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`description` text,
	`category` varchar(128),
	`status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
	`slipUrl` text,
	`slipKey` text,
	`dueDate` timestamp,
	`paidAt` timestamp,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `slips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`expenseId` int,
	`accountId` int,
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`fileName` varchar(255),
	`mimeType` varchar(128),
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slips_id` PRIMARY KEY(`id`)
);
