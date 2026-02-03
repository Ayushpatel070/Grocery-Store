import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyAddress } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
    fetchProducts,
  } = useAppContext();

  // state to store the products available in cart
  const [cartArray, setCartArray] = useState([]);
  // state to address
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  // state for selected address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      if (!product) continue;
      // do not mutate original product object (stock).
      // store cart quantity separately as `cartQuantity`.
      const item = { ...product, cartQuantity: cartItems[key] };
      tempArray.push(item);
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const isScriptReady = await loadRazorpayScript();
      if (!isScriptReady) {
        toast.error("Failed to load payment gateway");
        setIsProcessing(false);
        return;
      }

      const amount = totalCartAmount() + (totalCartAmount() * 2) / 100;

      // Step 1: Create Razorpay order
      const { data: orderData } = await axios.post(
        "/api/payment/create-order",
        {
          amount,
          currency: "INR",
        }
      );

      if (!orderData.success) {
        toast.error("Failed to create payment order");
        setIsProcessing(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Grocery Store",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const { data: verifyData } = await axios.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cartArray.map((item) => ({
                  product: item._id,
                  quantity: item.cartQuantity || 0,
                })),
                address: selectedAddress._id,
                amount,
              }
            );

            if (verifyData.success) {
              toast.success("Payment successful! Order placed.");
              setCartItems({});
              await fetchProducts(); // refresh stock after order
              navigate("/my-orders");
            } else {
              toast.error(verifyData.message);
            }
          } catch (error) {
            toast.error("Payment verification failed");
            console.error(error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: selectedAddress?.phone || "",
        },
        theme: {
          color: "#615fff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Error processing payment");
      console.error(error);
      setIsProcessing(false);
    }
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      if (paymentOption === "COD") {
        setIsProcessing(true);
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.cartQuantity || 0,
          })),
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          await fetchProducts(); // refresh stock after order
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
        setIsProcessing(false);
      } else if (paymentOption === "Online") {
        await handleRazorpayPayment();
      }
    } catch (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };
  return products.length > 0 && cartItems ? (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 py-12 md:py-16 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
      {/* Left Section: Cart Items */}
      <div className="flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
          Shopping Cart{" "}
          <span className="text-sm md:text-base text-indigo-500 font-medium">({cartCount()} Items)</span>
        </h1>

        {/* Header Row - Desktop Only */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-sm font-semibold pb-3 border-b border-gray-200">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          {cartArray.map((product, index) => (
            <div
              key={index}
              className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr] gap-3 sm:gap-4 text-gray-500 items-start sm:items-center text-sm font-medium pb-4 sm:pb-3 border-b border-gray-200"
            >
              {/* Product Image & Details */}
              <div className="flex items-start gap-3 sm:gap-4 w-full">
                <div
                  onClick={() => {
                    navigate(`product/${product.category}/${product._id}`);
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center border border-gray-300 rounded hover:border-indigo-400 transition bg-gray-50"
                >
                  <img
                    className="max-w-full h-full object-cover"
                    src={`http://localhost:5000/images/${product.image[0]}`}
                    alt={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm sm:text-base truncate">{product.name}</p>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2 space-y-1">
                    <p>Weight: <span className="font-medium">{product.weight || "N/A"}</span></p>
                    <div className="flex items-center gap-2">
                      <label htmlFor={`qty-${product._id}`} className="font-medium">Qty:</label>
                      <select
                        id={`qty-${product._id}`}
                        onChange={(e) => {
                          const newQty = Number(e.target.value);
                          const available = Number(product.quantity) || 0;
                          if (newQty > available) {
                            toast.error(`Only ${available} in stock`);
                            updateCartItem(product._id, available);
                          } else {
                            updateCartItem(product._id, newQty);
                          }
                        }}
                        value={cartItems[product._id]}
                        className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500 text-xs"
                      >
                        {(() => {
                          const available = Number(product.quantity) || 0;
                          const maxSelectable = Math.min(available, 9);
                          const currentQty = cartItems[product._id] || 1;
                          const optionsCount = Math.max(maxSelectable, currentQty);
                          return Array(optionsCount)
                            .fill("")
                            .map((_, idx) => (
                              <option key={idx} value={idx + 1}>
                                {idx + 1}
                              </option>
                            ));
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtotal and Delete - Mobile */}
              <div className="flex justify-between items-center w-full sm:hidden">
                <p className="font-semibold text-gray-700">₹{product.offerPrice * (product.cartQuantity || 0)}</p>
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer hover:opacity-70 transition"
                  aria-label="Remove from cart"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                      stroke="#FF532E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Subtotal - Desktop */}
              <p className="hidden sm:block text-center font-semibold text-gray-700">
                ₹{product.offerPrice * (product.cartQuantity || 0)}
              </p>

              {/* Delete Button - Desktop */}
              <button
                onClick={() => removeFromCart(product._id)}
                className="hidden sm:flex cursor-pointer mx-auto hover:opacity-70 transition"
                aria-label="Remove from cart"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                    stroke="#FF532E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium text-sm hover:text-indigo-600 transition"
        >
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#615fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>
      </div>

      {/* Right Section: Order Summary */}
      <div className="w-full lg:max-w-96 bg-gray-50 p-4 sm:p-6 border border-gray-200 rounded-lg h-fit lg:sticky lg:top-24">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">Order Summary</h2>
        <hr className="border-gray-300 mb-6" />

        {/* Delivery Address */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm font-semibold uppercase text-gray-700 mb-3">Delivery Address</p>
          <div className="relative">
            <div className="flex justify-between items-start gap-2 mb-2">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                  : "No Address Found"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-xs sm:text-sm text-indigo-500 hover:underline cursor-pointer font-medium shrink-0"
              >
                Change
              </button>
            </div>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-xs sm:text-sm w-full z-20 rounded shadow-lg max-h-48 overflow-y-auto">
                {address.map((addr, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddress(false);
                    }}
                    className="text-gray-600 p-2 hover:bg-indigo-50 cursor-pointer transition border-b border-gray-100 last:border-0"
                  >
                    {addr.street}, {addr.city}, {addr.state}, {addr.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-50 font-medium transition bg-indigo-50/50"
                >
                  + Add new address
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm font-semibold uppercase text-gray-700 mb-3">Payment Method</p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2.5 text-sm rounded outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Order Total */}
        <div className="text-gray-600 space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Price</span>
            <span className="font-semibold text-gray-700">₹{totalCartAmount()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Shipping Fee</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Tax (2%)</span>
            <span className="font-semibold text-gray-700">₹{Math.round((totalCartAmount() * 2) / 100)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-300">
            <span className="font-bold text-gray-700">Total Amount:</span>
            <span className="font-bold text-indigo-600 text-lg">₹{totalCartAmount() + (totalCartAmount() * 2) / 100}</span>
          </div>
        </div>

        <button
          onClick={placeOrder}
          disabled={isProcessing}
          className="w-full py-3 cursor-pointer bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isProcessing
            ? "Processing..."
            : paymentOption === "COD"
            ? "Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};
export default Cart;
