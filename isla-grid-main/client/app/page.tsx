import PageNavbar from "./components/PageNavbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import AboutSection from "./components/AboutSection";
import FeaturesSection from "./components/FeaturesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const Home = () => (
  <div className="bg-white text-gray-800 antialiased">
    <PageNavbar />
    <HeroSection />
    <main>
      <ProblemSection />
      <SolutionSection />
      <AboutSection />
      <FeaturesSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Home;
