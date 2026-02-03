import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  // recentlyAdded is stored per-user in localStorage under key `recentlyAdded_<userId|email>`
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // check seller status
const fetchSeller = async () => {
  try {
    const { data } = await axios.get("/api/seller/is-auth");
    setIsSeller(data.success === true);
  } catch {
    setIsSeller(false);
  }
};

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart);
      } 
    } catch (error) {
      // Don't show error for 401 (Unauthorized) - it's expected when logged out
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // add product to cart
  const addToCart = (itemId) => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in first");
      setShowUserLogin(true);
      return;
    }

    // Find the product to check available quantity
    const product = products.find((p) => p._id === itemId);
    
    let cartData = structuredClone(cartItems || {}); // safeguard for undefined
    let newQuantity = cartData[itemId] ? cartData[itemId] + 1 : 1;

    // Check if quantity exceeds available stock
    if (newQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} quantity of ${product.name} left`);
      return;
    }

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    // Update cart items
    setCartItems(cartData);
    toast.success("Added to cart");

    // Update recently added list (most recent first), keep unique, limit 10
    try {
      // Only persist per-user recently added lists
      if (user) {
        let list = Array.isArray(recentlyAdded) ? [...recentlyAdded] : [];
        // remove if already exists
        list = list.filter((id) => id !== itemId);
        // add to front
        list.unshift(itemId);
        // limit
        if (list.length > 10) list = list.slice(0, 10);
        setRecentlyAdded(list);
        const key = `recentlyAdded_${user._id ?? user.email}`;
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch (e) {
      // ignore localStorage errors
      console.error(e);
    }
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    // ensure we don't set quantity greater than available stock
    const product = products.find((p) => p._id === itemId);
    const available = Number(product?.quantity) || 0;
    const newQty = Math.min(quantity, available);
    let cartData = structuredClone(cartItems);
    if (newQty > 0) {
      cartData[itemId] = newQty;
    } else {
      delete cartData[itemId];
    }
    setCartItems(cartData);
    if (newQty < quantity) {
      toast.error(`Only ${available} in stock`);
    } else {
      toast.success(`Cart updated`);
    }
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += cartItems[items] * itemInfo.offerPrice;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      delete cartData[itemId];
      toast.success(`Removed from cart`);
      setCartItems(cartData);
    }
  };

  // logout function to clear user and cart data
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data?.success) {
        toast.success(data.message || "Logged out successfully");
      }
    } catch (error) {
      // If the user cookie/token is not present (e.g., admin/seller logout), the backend
      // may return 401. We should still clear client-side auth state.
      if (error.response?.status && (error.response.status === 401 || error.response.status === 403)) {
        // expected when not logged-in as regular user; ignore server error
      } else {
        toast.error(error.message);
      }
    } finally {
      // Always clear local client state and redirect to home
      setUser(null);
      setCartItems({});
      setIsSeller(false);
      // Also clear recentlyAdded in memory when logged out
      setRecentlyAdded([]);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // Load per-user recentlyAdded from localStorage when user changes
  useEffect(() => {
    try {
      if (user) {
        const key = `recentlyAdded_${user._id ?? user.email}`;
        const raw = localStorage.getItem(key);
        setRecentlyAdded(raw ? JSON.parse(raw) : []);
      } else {
        // No user logged in -> clear recently added in memory
        setRecentlyAdded([]);
        // remove legacy/global key if present
        try {
          localStorage.removeItem("recentlyAdded");
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      console.error(e);
      setRecentlyAdded([]);
    }
  }, [user]);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
    recentlyAdded,
    logout,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};