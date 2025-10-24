import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import HowSystemWorks from "../../components/HowSystemWorks/HowSystemWorks";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <HowSystemWorks />
    </>
  );
};

export default Home;
