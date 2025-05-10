import { Link } from "@tanstack/react-router";

import { Button } from "@ui/components/ui/button";

import { useCurrentUser } from "~common/providers/current-user-provider";

export function CtaSection() {
  const { user } = useCurrentUser();

  return (
    <section className="bg-primary text-primary-foreground flex w-full justify-center py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-2 sm:mx-auto lg:gap-12">
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
            <Link
              to={user ? "/me" : "."}
              search={(prev) => ({ ...prev, signIn: user ? undefined : "true" })}
            >
              <Button size="lg" variant="secondary">
                Get Started For Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
