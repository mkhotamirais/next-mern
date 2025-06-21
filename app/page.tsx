import HeroSection from "./(home-sections)/HeroSection";
import PostSection from "./(home-sections)/PostSection";
import ProductSection from "./(home-sections)/ProductSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProductSection />
      <PostSection />
    </div>
  );
}
