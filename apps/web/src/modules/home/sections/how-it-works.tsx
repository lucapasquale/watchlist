export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full flex justify-center py-12 md:py-24 lg:py-32">
      <div className="container px-2 sm:mx-auto grid gap-6 lg:gap-12 items-center">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Creating and sharing playlists is simple and intuitive
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl items-start gap-12 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-bold">Sign Up</h3>
            <p className="text-muted-foreground">
              Create your account in seconds and start building playlists
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-bold">Add Videos</h3>
            <p className="text-muted-foreground">
              Paste URLs from YouTube, Reddit, or other supported platforms
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-bold">Share & Enjoy</h3>
            <p className="text-muted-foreground">Watch your playlist or share it with others</p>
          </div>
        </div>
      </div>
    </section>
  );
}
