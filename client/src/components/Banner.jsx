import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg md:rounded-none">
      <img
        src={assets.main_banner_bg}
        alt="Banner"
        className="hidden md:block w-full h-auto"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="Banner Mobile"
        className="md:hidden w-full h-auto"
      />
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-12 sm:pb-16 md:pb-0 md:pl-12 lg:pl-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg leading-tight px-4 sm:px-0">
          Freshness You Can Trust, Savings You will Love!
        </h1>
        <div className="flex flex-col sm:flex-row items-center mt-6 font-medium gap-4 sm:gap-6 px-4 sm:px-0">
          <Link
            to={"/products"}
            className="w-full sm:w-auto flex group items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded text-white bg-primary hover:opacity-90 transition text-sm sm:text-base"
          >
            Shop Now
            <img
              src={assets.white_arrow_icon}
              alt="arrow"
              className="transition group-hover:translate-x-1"
            />
          </Link>
          <Link
            to={"/products"}
            className="hidden sm:flex group items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded text-white bg-primary hover:opacity-90 transition"
          >
            Explore Deals
            <img
              src={assets.white_arrow_icon}
              alt="arrow"
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Banner;