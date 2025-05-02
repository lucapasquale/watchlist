import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";
import {
  Play,
  RssIcon as Reddit,
  Youtube,
  Twitch,
  ListPlus,
  Share2,
  CheckCircle2,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Sources Section */}
        <section id="sources" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
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
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Youtube className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">YouTube</h3>
                <p className="text-center text-muted-foreground">
                  Add any YouTube video to your playlists with just a URL
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Reddit className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Reddit</h3>
                <p className="text-center text-muted-foreground">
                  Collect videos from Reddit posts and comments
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-4">
                  <Twitch className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Twitch</h3>
                <p className="text-center text-muted-foreground">
                  Save your favorite Twitch clips and streams
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
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

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  How It Works
                </h2>
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

        {/* CTA Section */}
        <section className="py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Create Your First Playlist?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are already enjoying custom video playlists
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/" hash="/signup">
                    Get Started For Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
