import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const product = products.find((product) => product._id === id);
  // console.log("product", product);
  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (product) => product.category === product.category
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);
  return (
    product && (
      <div className="mt-12 md:mt-16 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
        <p className="text-xs sm:text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to={"/products"} className="hover:text-primary"> Products</Link>
          <span>/</span>
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary">
            {" "}{product.category}
          </Link>
          <span>/</span>
          <span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-16 mt-4">
          {/* Image Section */}
          <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
            <div className="flex flex-col gap-2 sm:gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border border-gray-500/30 rounded overflow-hidden cursor-pointer hover:border-indigo-400 transition"
                >
                  <img
                    src={`http://localhost:5000/images/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 object-cover hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 rounded overflow-hidden flex-1 md:flex-none md:max-w-md flex items-center justify-center bg-gray-50">
              <img
                src={`http://localhost:5000/images/${thumbnail}`}
                alt="Selected product"
                className="w-full h-auto max-h-80 object-contain"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-2">{product.name}</h1>

            <div className="flex items-center gap-0.5 mt-2">
              {Array(5)
                .fill("")
                .map(
                  (_, i) =>
                    product.rating >
                    (
                      <img
                        src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        key={i}
                        className="w-3 sm:w-3.5 md:w-4"
                      />
                    )
                )}
              <p className="text-sm sm:text-base ml-2">(4)</p>
            </div>

            <div className="mt-6 mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500/70 line-through text-sm">
                MRP: ₹{product.price}
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-500 mt-1">₹{product.offerPrice}</p>
              <span className="text-xs sm:text-sm text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <div className="mb-6">
              <p className="text-base sm:text-lg font-semibold mb-3">About Product</p>
              <ul className="list-disc ml-4 text-gray-500/70 text-sm sm:text-base space-y-1">
                {product.description.map((desc, index) => (
                  <li key={index} className="line-clamp-2">{desc}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-8 sticky bottom-0 bg-white pt-4 pb-2 md:pb-0 md:bg-transparent md:sticky-none md:pt-0">
              <button
                onClick={() => addToCart(product._id)}
                className="w-full py-3 cursor-pointer font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition rounded text-sm sm:text-base"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                  scrollTo(0, 0);
                }}
                className="w-full py-3 cursor-pointer font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition rounded text-sm sm:text-base"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="flex flex-col items-center mt-16 md:mt-20 mb-8">
          <div className="flex flex-col items-center w-max mb-6 md:mb-8">
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold">Related Products</p>
            <div className="w-16 sm:w-20 h-1 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="w-full my-6 md:my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="w-full sm:w-1/2 md:w-64 my-8 py-3 cursor-pointer font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition rounded text-sm sm:text-base"
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};
export default SingleProduct;
