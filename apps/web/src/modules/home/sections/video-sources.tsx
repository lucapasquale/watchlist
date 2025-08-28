import { PlaylistItemKindIcon } from "~common/components/playlist-item-kind-icon";
import { PlaylistItemKind } from "~common/graphql-types";
import { PLAYLIST_ITEM_KIND } from "~common/translations";

const sources: PlaylistItemKind[] = [
  PlaylistItemKind.Youtube,
  PlaylistItemKind.Reddit,
  PlaylistItemKind.X,
  PlaylistItemKind.TwitchClip,
  PlaylistItemKind.KickClip,
];

export function VideoSourcesSection() {
  return (
    <section id="sources" className="flex w-full justify-center py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-2 sm:mx-auto lg:gap-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              All Your Favorite Video Sources
            </h2>
            <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create playlists that combine videos from multiple platforms in one place
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-6 py-12 md:grid-cols-3">
          {sources.map((kind) => (
            <VideoSource
              key={kind}
              icon={<PlaylistItemKindIcon kind={kind} className="text-primary size-10" />}
              title={PLAYLIST_ITEM_KIND[kind]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSource({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-transform hover:scale-105 hover:transform">
      <div className="bg-primary/10 rounded-full p-4">{icon}</div>

      <h3 className="text-xl font-bold">{title}</h3>
    </div>
  );
}
