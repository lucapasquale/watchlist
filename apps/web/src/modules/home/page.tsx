import { LandingPage } from "./v0";
import { HeroSection } from "./sections/hero";

export function Page() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection />
      <LandingPage />
    </main>
  );
}
