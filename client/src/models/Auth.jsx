import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/");
        setUser(data.user);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };
  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/50 text-gray-600 p-4"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md items-start p-6 sm:p-8 py-10 sm:py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-xl sm:text-2xl font-semibold m-auto w-full text-center">
          <span className="text-indigo-500">User</span>{" "}
          {state === "login" ? "Login" : "Register"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
              className="border border-gray-200 rounded w-full p-2.5 sm:p-3 mt-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-200 rounded w-full p-2.5 sm:p-3 mt-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-200 rounded w-full p-2.5 sm:p-3 mt-1 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
            type="password"
            required
          />
        </div>
        
        <p className="text-xs sm:text-sm text-center w-full mt-2">
          {state === "register" ? (
            <>
              Already have account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-indigo-500 cursor-pointer font-medium hover:underline"
              >
                click here
              </span>
            </>
          ) : (
            <>
              Create an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-indigo-500 cursor-pointer font-medium hover:underline"
              >
                click here
              </span>
            </>
          )}
        </p>
        
        <button className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all text-white py-2.5 sm:py-3 rounded-md cursor-pointer font-semibold mt-4 text-sm sm:text-base">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};
export default Auth;