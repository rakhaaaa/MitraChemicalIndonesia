CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`product_id` text,
	`product_name` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'baru' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`notification_status` text DEFAULT 'menunggu-konfigurasi' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_created_at` ON `inquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_status_created_at` ON `inquiries` (`status`,`created_at`);