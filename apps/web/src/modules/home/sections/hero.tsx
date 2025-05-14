import { useQuery } from "@apollo/client";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button } from "@ui/components/ui/button";
import { Card } from "@ui/components/ui/card";
import { Skeleton } from "@ui/components/ui/skeleton";

import { PlaylistItemKindIcon } from "~common/components/playlist-item-kind-icon";
import { HomeHeroPlaylistsDocument } from "~common/graphql-types";
import { useCurrentUser } from "~common/providers/current-user-provider";

export function HeroSection() {
  const { user } = useCurrentUser();
  const { data, loading } = useQuery(HomeHeroPlaylistsDocument);

  return (
    <section className="bg-muted/50 flex w-full justify-center py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-2 sm:mx-auto lg:grid-cols-2 lg:gap-12">
        <article className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Create Video Playlists From Anywhere
            </h1>

            <p className="text-muted-foreground max-w-[600px] md:text-xl">
              Combine videos from YouTube, Reddit, and more into custom playlists. Share with
              friends or keep them private.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              to={user ? "/me" : "."}
              search={(prev) => ({ ...prev, signIn: user ? undefined : "true" })}
            >
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link to="." hash="how-it-works">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </article>

        <article className="space-y-4 lg:order-last">
          <h2 className="text-2xl font-bold">Most Popular Playlists</h2>

          {loading && (
            <>
              <Skeleton className="bg-card h-24 w-full rounded-lg border shadow-sm" />
              <Skeleton className="bg-card h-24 w-full rounded-lg border shadow-sm" />
              <Skeleton className="bg-card h-24 w-full rounded-lg border shadow-sm" />
            </>
          )}

          {data?.playlists.slice(0, 3).map((playlist) => (
            <Card key={playlist.id}>
              <Link
                to="/p/$playlistID/$videoID"
                params={{ playlistID: playlist.id, videoID: playlist.firstItem?.id ?? "" }}
                className="group hover:no-underline"
              >
                <div className="px-4">
                  <div className="mb-2 flex items-center justify-between group-hover:underline">
                    <h3 className="text-lg font-bold">{playlist.name}</h3>

                    <Avatar>
                      <AvatarImage src={playlist.user.profilePictureUrl ?? undefined} />
                      <AvatarFallback>{playlist.user.initials}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {playlist.itemsKind.map((kind) => (
                        <div key={kind} className="bg-primary/10 rounded-full p-1">
                          <PlaylistItemKindIcon kind={kind} className="text-primary" />
                        </div>
                      ))}
                    </div>

                    <span className="text-muted-foreground text-sm">
                      {playlist.itemsCount} videos
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </article>
      </div>
    </section>
  );
}
