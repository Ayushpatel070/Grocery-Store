import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
    logout,
  } = useAppContext();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, []);
  return (
    <nav className="top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-3 sm:py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link to="/">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Grocery App</h2>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        <Link to={"/"} className="text-sm lg:text-base hover:text-primary transition">Home</Link>
        <Link to={"/products"} className="text-sm lg:text-base hover:text-primary transition">All Products</Link>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 py-2 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {user && (
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer hover:opacity-70 transition"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-4.5 h-4.5 rounded-full font-semibold">
              {cartCount()}
            </button>
          </div>
        )}

        {user ? (
          <div className="relative group">
            <img src={assets.profile_icon} alt="Profile" className="w-8 lg:w-10 cursor-pointer hover:opacity-70 transition" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2 w-32 rounded-md z-40 text-sm">
              <li
                onClick={() => { navigate("/my-orders"); scrollTo(0, 0); }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
              >
                My Orders
              </li>
              <li className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition" onClick={logout}>
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-6 lg:px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Right Section */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <div
            className="relative cursor-pointer hover:opacity-70 transition"
            onClick={() => navigate("/cart")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-4.5 h-4.5 rounded-full font-semibold">
              {cartCount()}
            </button>
          </div>
        )}
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="md:hidden p-2 hover:bg-gray-100 rounded transition"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#615fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H21M3 12H21M3 18H21" stroke="#615fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-full left-0 w-full bg-white shadow-lg py-4 flex-col items-start gap-2 px-4 sm:px-5 text-sm md:hidden border-t border-gray-200`}
      >
        <Link onClick={() => setOpen(false)} to={"/"} className="w-full px-4 py-2 hover:bg-gray-100 rounded transition">
          Home
        </Link>
        <Link onClick={() => setOpen(false)} to={"/products"} className="w-full px-4 py-2 hover:bg-gray-100 rounded transition">
          Products
        </Link>

        {user ? (
          <div className="w-full flex flex-col gap-2 border-t border-gray-200 pt-2 mt-2">
            <button
              onClick={() => { navigate("/my-orders"); setOpen(false); scrollTo(0, 0); }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded transition"
            >
              My Orders
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded transition"
              onClick={() => { logout(); setOpen(false); }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="w-full cursor-pointer px-4 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded font-medium"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;