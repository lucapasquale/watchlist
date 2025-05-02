import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { Profile } from "./profile.js";

export function Header() {
  return (
    <header className="sticky h-[90px] top-0 z-10 flex items-center w-full bg-background/80 backdrop-blur border-0 border-b border-solid border-neutral-500">
      <nav className="container px-2 sm:mx-auto flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">watchlist</span>
            <Play className="h-6 w-6 text-primary" />
          </div>
        </Link>

        <Profile />
      </nav>
    </header>
  );
}
