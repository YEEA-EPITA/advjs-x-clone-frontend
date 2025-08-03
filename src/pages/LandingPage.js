import "../styles/LandingPage.css";
import Navbar from "../components/LandingComponent/Navbar";
import HeroSection from "../components/LandingComponent/HeroSection";
import FeatureSection from "../components/LandingComponent/FeatureSection";
import CallToAction from "../components/LandingComponent/CallToAction";
import Footer from "../components/LandingComponent/Footer";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Call to Action Section */}
      <CallToAction />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
