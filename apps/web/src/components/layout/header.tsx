import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky h-[90px] top-0 z-10 py-6 px-4 w-full flex items-center bg-background/80 backdrop-blur border-0 border-b border-solid border-gray-500">
      <nav>
        <Link to="/">
          <h3 className="text-lg">watchlist</h3>
        </Link>
      </nav>
    </header>
  );
}
