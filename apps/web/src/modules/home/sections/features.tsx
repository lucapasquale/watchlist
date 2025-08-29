import { ListPlus, Play } from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-muted flex w-full justify-center px-2 py-12 md:py-24 lg:py-32"
    >
      <div className="container grid items-center gap-6 px-2 sm:mx-auto lg:gap-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Powerful Playlist Features
            </h2>
            <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to create, manage, and share your video collections
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <ListPlus className="text-primary h-5 w-5" />
              <h3 className="text-xl font-bold">Create Custom Playlists</h3>
            </div>
            <p className="text-muted-foreground">
              Organize videos from different sources into themed collections
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Play className="text-primary h-5 w-5" />
              <h3 className="text-xl font-bold">Continuous Playback</h3>
            </div>
            <p className="text-muted-foreground">
              Watch your entire playlist without interruptions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
