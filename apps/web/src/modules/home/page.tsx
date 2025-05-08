import { CtaSection } from "./sections/cta";
import { FeaturesSection } from "./sections/features";
import { HeroSection } from "./sections/hero";
import { HowItWorksSection } from "./sections/how-it-works";
import { VideoSourcesSection } from "./sections/video-sources";

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
