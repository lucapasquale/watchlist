import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="flex justify-center border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} watchlist. All rights reserved.
          </p>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" hash="" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link to="/" hash="" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/" hash="" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
