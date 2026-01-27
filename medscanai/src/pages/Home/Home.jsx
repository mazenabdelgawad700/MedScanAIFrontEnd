import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import WhyUs from "../../components/WhyUs/WhyUs";
import HowSystemWorks from "../../components/HowSystemWorks/HowSystemWorks";
import Testimonials from "../../components/Testimonials/Testimonials";
import AreYouReady from "../../components/AreYouReady/AreYouReady";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyUs />
      <HowSystemWorks />
      <Testimonials />
      <AreYouReady />
      <Footer />
    </>
  );
};

export default Home;

