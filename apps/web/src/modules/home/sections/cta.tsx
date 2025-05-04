import { Link } from "@tanstack/react-router";
import { Button } from "@ui/components/ui/button";

export function CtaSection() {
  return (
    <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-2 sm:mx-auto grid gap-6 lg:gap-12 items-center">
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
            <Link to="." search={(prev) => ({ ...prev, signup: "true" })}>
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
