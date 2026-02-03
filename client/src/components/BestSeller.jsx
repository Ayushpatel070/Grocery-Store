import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";

const BestSeller = () => {
  const { products, axios } = useAppContext();
  const [popular, setPopular] = useState([]);

  const fallback = products.filter((p) => p.inStock).slice(0, 5);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await axios.get("/api/product/best-sellers");
        if (data?.success && Array.isArray(data.bestSellers)) {
          // bestSellers contains objects { product, totalOrdered }
          const prods = data.bestSellers
            .map((p) => p.product)
            .filter(Boolean)
            .slice(0, 5);
          setPopular(prods);
        } else {
          setPopular(fallback.slice(0, 5));
        }
      } catch (e) {
        setPopular(fallback.slice(0, 5));
      }
    };

    fetchPopular();
  }, [axios, products]);

  const listToShow = popular.length > 0 ? popular : fallback;

  const title = "Best Sellers";

  return (
    <div className="mt-12 md:mt-16">
      <p className="text-xl sm:text-2xl md:text-3xl font-medium">{title}</p>
      <div className="my-6 md:my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 items-start">
        {listToShow.map((product, index) => (
          <ProductCard key={product._id || index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;