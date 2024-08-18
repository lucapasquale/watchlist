ALTER TABLE "videos" ALTER COLUMN "sort_order" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "raw_url" varchar(256) NOT NULL;