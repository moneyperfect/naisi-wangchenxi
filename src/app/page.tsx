import { HeroSection } from "@/components/home/HeroSection";
import { DaysCounter } from "@/components/home/DaysCounter";
import { QuickLinks } from "@/components/home/QuickLinks";
import { HomeIntro } from "./HomeIntro";

export default function Home() {
  return (
    <HomeIntro>
      <div style={{ minHeight: "100dvh" }}>
        <HeroSection />
        <DaysCounter />
        <QuickLinks />
      </div>
    </HomeIntro>
  );
}
