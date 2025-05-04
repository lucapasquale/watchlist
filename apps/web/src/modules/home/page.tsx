import { HeroSection } from "./sections/hero";
import { FeaturesSection } from "./sections/features";
import { VideoSourcesSection } from "./sections/video-sources";
import { HowItWorksSection } from "./sections/how-it-works";
import { CtaSection } from "./sections/cta";

export function Page() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection />

      <VideoSourcesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </main>
  );
}
