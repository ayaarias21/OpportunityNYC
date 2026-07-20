import Hero from "../components/Hero";
import IWantSection from "../components/IWantSection";
import FeaturedOpportunities from "../components/FeaturedOpportunities";
import Footer from "../components/Footer";
import HelpButton from "../components/HelpButton";

export default function Homepage() {
  return (
    <div>
      <Hero />
      <IWantSection />
      <FeaturedOpportunities />
      <Footer />
      <HelpButton />
    </div>
  );
}
