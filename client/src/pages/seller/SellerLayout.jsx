import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
const SellerLayout = () => {
  const { isSeller, setIsSeller, axios, navigate, logout } = useAppContext();
  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const handleSellerLogout = async () => {
    try {
      // Call seller logout endpoint
      await axios.get("/api/seller/logout");
      // Call the unified logout to clear all user state
      await logout();
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 border-b border-gray-300 py-3 md:py-4 bg-white transition-all duration-300">
        <Link to={"/"}>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-500">Grocery Store</h1>
        </Link>
        <div className="flex items-center gap-3 md:gap-5 text-gray-500 text-sm md:text-base">
          <p className="hidden sm:block">Hi! Admin</p>
          <button
            onClick={handleSellerLogout}
            className="border border-gray-300 rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 cursor-pointer hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex h-[calc(100vh-70px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-12 sm:w-16 md:w-64 border-r border-gray-300 bg-white overflow-y-auto flex flex-col">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) => `flex items-center justify-center md:justify-start py-4 sm:py-5 px-2 sm:px-3 md:px-4 gap-3 text-xs sm:text-sm md:text-base border-r-4 transition
                            ${
                              isActive
                                ? "md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500 font-medium"
                                : "border-transparent hover:bg-gray-100/90 text-gray-600"
                            }`}
              title={item.name}
            >
              <img src={item.icon} alt={item.name} className="w-5 h-5 sm:w-6 sm:h-6" />
              <p className="hidden md:block">{item.name}</p>
            </NavLink>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default SellerLayout;
