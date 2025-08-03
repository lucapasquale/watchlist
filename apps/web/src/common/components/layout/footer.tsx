export function Footer() {
  return (
    <footer className="flex justify-center border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} watchlist. All rights reserved.
          </p>
        </div>

        <div/>
      </div>
    </footer>
  );
}
