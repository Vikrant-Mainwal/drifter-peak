import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { FeaturedDrop } from "@/components/sections/FeaturedDrop";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { LifestyleSection } from "@/components/sections/LifestyleSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <FeaturedDrop />
      <BrandStatement />
      <ProductGrid />
      <LifestyleSection />
      <Footer />
    </>
  );
}
