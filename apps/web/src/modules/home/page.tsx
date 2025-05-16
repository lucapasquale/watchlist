import { Helmet } from "react-helmet-async";

import { CtaSection } from "./sections/cta";
import { FeaturesSection } from "./sections/features";
import { HeroSection } from "./sections/hero";
import { HowItWorksSection } from "./sections/how-it-works";
import { VideoSourcesSection } from "./sections/video-sources";

export function Page() {
  return (
    <>
      <Helmet>
        <title>watchlist • Watch your favorite videos</title>
      </Helmet>

      <main className="flex flex-col items-center">
        <HeroSection />

        <VideoSourcesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
    </>
  );
}
