ALTER TABLE "videos" DROP CONSTRAINT "videos_playlist_id_playlists_id_fk";
--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "kind" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "playlist_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "videos" ADD CONSTRAINT "videos_playlist_id_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
