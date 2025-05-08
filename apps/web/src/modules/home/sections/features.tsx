import { CheckCircle2, ListPlus, Play, Share2 } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-2 sm:mx-auto grid gap-6 lg:gap-12 items-center">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Powerful Playlist Features
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to create, manage, and share your video collections
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:gap-12">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Create Custom Playlists</h3>
            </div>
            <p className="text-muted-foreground">
              Organize videos from different sources into themed collections
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Easy Sharing</h3>
            </div>
            <p className="text-muted-foreground">
              Share your playlists with friends or keep them private
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Track Watched Videos</h3>
            </div>
            <p className="text-muted-foreground">
              Keep track of what you've watched and where you left off
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
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
