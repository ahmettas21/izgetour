CREATE TABLE `affiliate_links` (
	`id` text PRIMARY KEY NOT NULL,
	`booking_source` text NOT NULL,
	`affiliate_url_template` text NOT NULL,
	`commission_note` text,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `affiliate_links_booking_source_unique` ON `affiliate_links` (`booking_source`);--> statement-breakpoint
CREATE TABLE `airports` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`lat` real,
	`lng` real
);
--> statement-breakpoint
CREATE TABLE `fetch_log` (
	`id` text PRIMARY KEY NOT NULL,
	`route_id` text,
	`status` text,
	`flights_found` integer,
	`error` text,
	`duration_ms` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `price_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`route_id` text,
	`depart_date` text NOT NULL,
	`airline_code` text,
	`airline_name` text,
	`flight_id` text,
	`departure_city` text,
	`departure_code` text,
	`arrival_city` text,
	`arrival_code` text,
	`departure_time` text,
	`arrival_time` text,
	`duration_minutes` integer,
	`stops` integer,
	`price_usd_cents` integer,
	`booking_source` text,
	`cabin` text,
	`fetched_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`raw` text
);
--> statement-breakpoint
CREATE INDEX `idx_price_cache_route_date` ON `price_cache` (`route_id`,`depart_date`);--> statement-breakpoint
CREATE INDEX `idx_price_cache_fetched_at` ON `price_cache` (`fetched_at`);--> statement-breakpoint
CREATE TABLE `routes` (
	`id` text PRIMARY KEY NOT NULL,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`slug` text,
	`popular` integer DEFAULT false NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`title_tr` text,
	`title_en` text,
	`description_tr` text,
	`description_en` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routes_slug_unique` ON `routes` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `routes_origin_destination_unique` ON `routes` (`origin`,`destination`);