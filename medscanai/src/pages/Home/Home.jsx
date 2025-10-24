import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import HowSystemWorks from "../../components/HowSystemWorks/HowSystemWorks";
import AreYouReady from "../../components/AreYouReady/AreYouReady";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <HowSystemWorks />
      <AreYouReady />
      <Footer />
    </>
  );
};

export default Home;
