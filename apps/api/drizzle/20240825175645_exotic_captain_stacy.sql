ALTER TABLE "videos" ADD COLUMN "title" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "thumbnail_url" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN IF EXISTS "sort_order";