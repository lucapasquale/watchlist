import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { Button } from "@ui/components/ui/button.js";

import { Github } from "../icons/index.js";
import { Profile } from "./profile.js";

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-[90px] w-full items-center border-0 border-b border-solid border-neutral-500 backdrop-blur">
      <nav className="container flex items-center justify-between pl-4 sm:mx-auto sm:pl-0">
        <Link to="/">
          <div className="flex h-12 items-center gap-2">
            <span className="text-xl font-bold">watchlist</span>
            <Play className="text-primary h-6 w-6" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/lucapasquale/watchlist"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>

          <Profile />
        </div>
      </nav>
    </header>
  );
}
