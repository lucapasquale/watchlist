import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button } from "@ui/components/ui/button";
import { Card } from "@ui/components/ui/card";
import { Skeleton } from "@ui/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { Reddit, Youtube } from "~common/components/icons";
import { HomeHeroPlaylistsDocument, PlaylistItemKind } from "~common/graphql-types";

export function HeroSection() {
  const { data, loading } = useQuery(HomeHeroPlaylistsDocument);

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <article className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Create Video Playlists From Anywhere
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Combine videos from YouTube, Reddit, and more into custom playlists. Share with
                friends or keep them private.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link to="/">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="." hash="how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
          </article>

          <article className="space-y-4 lg:order-last">
            <h2 className="text-2xl font-bold">Most Popular Playlists</h2>

            {loading && (
              <>
                <Skeleton className="h-24 w-full rounded-lg border bg-card shadow-sm" />
                <Skeleton className="h-24 w-full rounded-lg border bg-card shadow-sm" />
                <Skeleton className="h-24 w-full rounded-lg border bg-card shadow-sm" />
              </>
            )}

            {data?.playlists.slice(0, 3).map((playlist) => (
              <Card key={playlist.id}>
                <Link
                  to="/p/$playlistID/$videoID"
                  params={{ playlistID: playlist.id, videoID: playlist.firstItem?.id ?? "" }}
                  className="h-24 rounded-lg border bg-card shadow-sm"
                >
                  <div key={playlist.id} className="h-24 rounded-lg border bg-card shadow-sm">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{playlist.name}</h3>

                        <Link to="/u/$userID" params={{ userID: playlist.user.id }}>
                          <Avatar>
                            <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
                            <AvatarFallback>{playlist.user.initials}</AvatarFallback>
                          </Avatar>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {playlist.itemsKind.map((kind) => {
                            const Icon = kind === PlaylistItemKind.Youtube ? Youtube : Reddit;

                            return (
                              <div key={kind} className="rounded-full bg-primary/10 p-1">
                                {Icon && <Icon className="size-4 text-primary" />}
                              </div>
                            );
                          })}
                        </div>

                        <span className="text-sm text-muted-foreground">
                          {playlist.itemsCount} videos
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
