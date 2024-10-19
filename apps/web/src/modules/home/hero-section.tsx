import { PlayCircle, Share2 } from "lucide-react";
import { Button } from "@ui/components/ui/button";

import { LoginModal } from "~common/components/login-modal";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                Create, Mix, Share Your Ultimate Video Playlists
              </h1>
              <p className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto lg:mx-0">
                Curate your favorite videos from multiple platforms, create awesome playlists, and
                share the joy with your friends. All in one place.
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <LoginModal>
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-purple-600 shadow transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-300 disabled:pointer-events-none disabled:opacity-50">
                  Get Started
                  <PlayCircle className="ml-2 h-5 w-5" />
                </Button>
              </LoginModal>

              <Button
                variant="outline"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-300 disabled:pointer-events-none disabled:opacity-50"
              >
                How It Works
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Video Playlist Illustration"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 rounded-xl" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">
                    Share your playlist with friends
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
