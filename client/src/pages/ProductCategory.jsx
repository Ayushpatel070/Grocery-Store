import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );
  return (
    <div className="mt-12 md:mt-16 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
      {searchCategory && (
        <div className="flex flex-col items-start md:items-end w-full md:w-max mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {searchCategory.text.toUpperCase()}
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-primary rounded-full mt-2"></div>
        </div>
      )}     
      {filteredProducts.length > 0 ? (
        <div>
          <div className="my-6 md:my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 items-start">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-16 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-500">
            No products found
          </h1>
        </div>
      )}
    </div>
  );
};
export default ProductCategory;
