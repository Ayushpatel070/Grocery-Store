import { useContext, useEffect, useState } from "react";
import { dummyOrders } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user, cartItems, setCartItems, products } = useContext(AppContext);
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const repeatOrder = (order) => {
    try {
      let cartData = structuredClone(cartItems || {});
      let hasStockIssues = false;
      
      // Add all items from the order to cart
      order.items.forEach((item) => {
        const product = products.find((p) => p._id === item.product._id);
        if (product) {
          if (product.quantity >= item.quantity) {
            cartData[item.product._id] = (cartData[item.product._id] || 0) + item.quantity;
          } else if (product.quantity > 0) {
            // Product has some stock but not enough
            cartData[item.product._id] = (cartData[item.product._id] || 0) + product.quantity;
            toast.error(`Only ${product.quantity} ${item.product.name} left in stock (you ordered ${item.quantity})`);
            hasStockIssues = true;
          } else {
            // No stock available
            toast.error(`${item.product.name} is out of stock`);
            hasStockIssues = true;
          }
        } else {
          toast.error(`${item.product.name} is not available`);
          hasStockIssues = true;
        }
      });
      
      setCartItems(cartData);
      if (!hasStockIssues) {
        toast.success("Order items added to cart!");
      }
    } catch (error) {
      toast.error("Failed to repeat order");
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  return (
    <div className="mt-10 md:mt-12 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pb-12">
      <div className="mb-8">
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">My Orders</p>
        <div className="w-16 sm:w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {myOrders && myOrders.length > 0 ? (
        <div className="space-y-6">
          {myOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="bg-gray-50 p-4 sm:p-5 border-b border-gray-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-xs sm:text-sm mb-4">
                  <div>
                    <p className="text-gray-600 font-medium">Order ID</p>
                    <p className="text-gray-800 font-mono text-xs sm:text-sm break-all">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Payment</p>
                    <p className="text-gray-800">{order.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Total Amount</p>
                    <p className="text-indigo-600 font-bold text-base sm:text-lg">₹{order.amount}</p>
                  </div>
                </div>
                <button
                  onClick={() => repeatOrder(order)}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded font-medium text-sm hover:bg-primary-dark transition"
                >
                  Repeat Order
                </button>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-200">
                {order.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 sm:p-5 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 border border-gray-200 rounded bg-gray-50 flex items-center justify-center">
                        <img
                          src={`http://localhost:5000/images/${item.product.image[0]}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{item.product.category}</p>
                        <div className="flex gap-4 mt-2 text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Qty: <span className="font-semibold">{item.quantity || "1"}</span>
                          </span>
                          <span className="text-gray-600">
                            Status: <span className="font-semibold text-indigo-600">{order.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Amount & Date */}
                      <div className="flex flex-col items-end gap-2 sm:gap-3">
                        <p className="text-base sm:text-lg font-bold text-indigo-600">
                          ₹{item.product.offerPrice * item.quantity}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-lg sm:text-xl text-gray-500 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-400">Start shopping to see your orders here</p>
        </div>
      )}
    </div>
  );
};
export default MyOrders;
