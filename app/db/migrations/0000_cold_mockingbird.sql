CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`handle` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`avatar` text,
	`access_token` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_handle_unique` ON `user` (`handle`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);