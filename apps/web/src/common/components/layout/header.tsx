import { Link } from "@tanstack/react-router";

import { Profile } from "./profile.js";

export function Header() {
  return (
    <header className="sticky h-[90px] top-0 z-10 flex items-center w-full bg-background/80 backdrop-blur border-0 border-b border-solid border-gray-500">
      <nav className="container px-2 sm:mx-auto flex items-center justify-between">
        <Link to="/">
          <h3 className="text-lg">watchlist</h3>
        </Link>

        <Profile />
      </nav>
    </header>
  );
}
