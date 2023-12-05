CREATE TABLE `file` (
	`id` text PRIMARY KEY NOT NULL,
	`nub_id` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`nub_id`) REFERENCES `nub`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `nub` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`organization_id` text,
	`handle` text,
	`type` text DEFAULT 'public' NOT NULL,
	`description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`original_nub_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`original_nub_id`) REFERENCES `nub`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `nub_star` (
	`nub_id` text NOT NULL,
	`user_id` text NOT NULL,
	PRIMARY KEY(`nub_id`, `user_id`),
	FOREIGN KEY (`nub_id`) REFERENCES `nub`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`handle` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organization_user` (
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	PRIMARY KEY(`organization_id`, `user_id`),
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `revision` (
	`id` text PRIMARY KEY NOT NULL,
	`nub_id` text NOT NULL,
	FOREIGN KEY (`nub_id`) REFERENCES `nub`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `revision_file` (
	`revision_id` text NOT NULL,
	`file_id` text NOT NULL,
	`content` text NOT NULL,
	PRIMARY KEY(`file_id`, `revision_id`),
	FOREIGN KEY (`revision_id`) REFERENCES `revision`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`file_id`) REFERENCES `file`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_file_nub` ON `file` (`nub_id`);--> statement-breakpoint
CREATE INDEX `idx_nub_user` ON `nub` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_nub_organization` ON `nub` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `nub_user_id_handle_unique` ON `nub` (`user_id`,`handle`);--> statement-breakpoint
CREATE INDEX `idx_nub_stars_user` ON `nub_star` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `organization_handle_unique` ON `organization` (`handle`);--> statement-breakpoint
CREATE INDEX `idx_organization_user_user` ON `organization_user` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_organization_user_organization` ON `organization_user` (`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_revision_nub` ON `revision` (`nub_id`);