import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
const Category = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-12 md:mt-16">
      <p className="text-xl sm:text-2xl md:text-3xl font-medium">Categories</p>
      <div className="my-6 md:my-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 items-center justify-center">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group cursor-pointer py-3 sm:py-5 px-2 sm:px-3 rounded-lg gap-2 flex flex-col items-center justify-center transition transform hover:scale-105`}
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="max-w-16 sm:max-w-24 md:max-w-28 transition group-hover:scale-110"
            />
            <p className="text-xs sm:text-sm font-medium text-center line-clamp-2">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Category;