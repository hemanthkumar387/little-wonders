import HeroSection from "../../components/HeroSection/HeroSection";
import ExploreCollections from "../../components/ExploreCollections/ExploreCollections";
import MoreThanProduct from "../../components/MoreThanProduct/MoreThanProduct";
import HandmadeLifestyle from "../../components/HandmadeLifestyle/HandmadeLifestyle";
// import OurProcess from "../../components/OurProcess/OurProcess";
import OurCreations from "../../components/OurCreations/OurCreations";
import OurPackage from "../../components/OurPackage/OurPackage";
import HandmadeCTA from "../../components/HandmadeCTA/HandmadeCTA";

function HomePage() {
  return (
    <div className="app">
        <HeroSection />
        <ExploreCollections />
        <MoreThanProduct />
        <HandmadeLifestyle />
        {/* <OurProcess /> */}
        <OurPackage />
        <OurCreations />
        <HandmadeCTA />
        {/* Other sections will be added here */}
    </div>
  );
}

export default HomePage;
