import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();
  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/product/${product.category.toLowerCase()}/${product?._id}`
          );
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-lg p-2 sm:p-3 md:px-4 md:py-3 bg-white w-full transition-transform hover:shadow-md"
      >
        <div className="group cursor-pointer flex items-center justify-center px-1 sm:px-2 aspect-square mb-2">
          <img
            className="group-hover:scale-105 transition max-w-full max-h-32 sm:max-h-36 md:max-h-44 object-contain"
            src={`http://localhost:5000/images/${product.image[0]}`}
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-xs sm:text-sm">
          <p className="text-gray-600 text-xs uppercase tracking-wide">{product.category}</p>
          <p className="text-gray-700 font-medium text-sm sm:text-base md:text-lg truncate w-full mt-1">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-2.5 sm:w-3 md:w-3.5"
                />
              ))}
            <p className="text-xs sm:text-sm">(4)</p>
          </div>
          <div className="flex items-end justify-between mt-2 sm:mt-3 gap-2">
            <div>
              <p className="text-sm sm:text-base md:text-lg font-medium text-indigo-500">
                ₹{product.offerPrice}
              </p>
              <span className="text-xs sm:text-xs md:text-sm text-gray-500/60 line-through">
                ₹{product.price}
              </span>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-500 shrink-0"
            >
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9 rounded text-indigo-600 font-medium cursor-pointer text-xs sm:text-sm transition hover:bg-indigo-200"
                >
                  <img src={assets.cart_icon} alt="cart icon" className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Add</span>
                  <span className="sm:hidden">+</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1 sm:gap-2 bg-indigo-500/25 rounded select-none h-8 sm:h-9">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="cursor-pointer text-md px-1.5 sm:px-2 h-full hover:bg-indigo-500/40 rounded transition"
                  >
                    −
                  </button>
                  <span className="w-4 sm:w-5 text-center text-xs sm:text-sm font-medium">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="cursor-pointer text-md px-1.5 sm:px-2 h-full hover:bg-indigo-500/40 rounded transition"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default ProductCard;