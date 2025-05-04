import { Reddit, Youtube } from "~common/components/icons";

export function VideoSourcesSection() {
  return (
    <section id="sources" className="w-full flex justify-center py-12 md:py-24 lg:py-32">
      <div className="container px-2 sm:mx-auto grid gap-6 lg:gap-12 items-center">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              All Your Favorite Video Sources
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create playlists that combine videos from multiple platforms in one place
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl grid items-center gap-6 py-12 lg:grid-cols-2">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-4">
              <Youtube className="size-10 text-primary" />
            </div>

            <h3 className="text-xl font-bold">YouTube</h3>
            <p className="text-center text-muted-foreground">
              Add any YouTube video to your playlists with just a URL
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-4">
              <Reddit className="size-10 text-primary" />
            </div>

            <h3 className="text-xl font-bold">Reddit</h3>
            <p className="text-center text-muted-foreground">
              Collect videos from Reddit posts and comments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
