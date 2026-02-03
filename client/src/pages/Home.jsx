import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="mt-8 md:mt-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
      <Banner />
      <Category />
      <BestSeller />
      <NewsLetter />
    </div>
  );
};
export default Home;
