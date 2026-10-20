import CategorySection from "./components/CategorySection";
import FeaturedFoods from "./components/FeaturedFoods";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PopularFood from "./components/PopularFood";
import Review from "./components/Review";
import SpecialOffers from "./components/SpecialOffers";
import WhyChoose from "./components/WhyChoose";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFF8F3] dark:bg-gray-950">
      <Hero/>
      <FeaturedFoods/>
      <PopularFood/>
      <CategorySection/>
      <WhyChoose/>
      <SpecialOffers/>
      <HowItWorks/>
      <Review/>
      
     
      
    </main>
  );
}