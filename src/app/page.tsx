import { HeroSection } from "@/components/home/HeroSection";
import { DaysCounter } from "@/components/home/DaysCounter";
import { QuickLinks } from "@/components/home/QuickLinks";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DaysCounter />
      <QuickLinks />
    </div>
  );
}
