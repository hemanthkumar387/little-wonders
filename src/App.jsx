import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import ExploreCollections from "./components/ExploreCollections/ExploreCollections";
import MoreThanProduct from "./components/MoreThanProduct/MoreThanProduct";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  return (
    <div className="app">

      <Navbar />

      <main>
        <HeroSection />
        <ExploreCollections />
        <MoreThanProduct />

        {/* Other sections will be added here */}
      </main>

      <Footer />

    </div>
  );
}

export default App;