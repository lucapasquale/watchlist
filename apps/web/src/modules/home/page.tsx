import { ExamplePlaylistsSection } from "./example-playlists-section";
import HeroSection from "./hero-section";

export function Page() {
  return (
    <main className="flex flex-col">
      <HeroSection />

      <ExamplePlaylistsSection />
    </main>
  );
}
