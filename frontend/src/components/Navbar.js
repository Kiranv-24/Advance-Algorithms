import React, { useState, useEffect } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/api";


const Navbar = () => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    fetchCartCount();

    // Listen for the 'cart-updated' event and update cart count
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await cartService.getCart();
      setCartItemCount(response.data.length); // Assuming response contains an array of cart items
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-[#0056D2] to-[#66C0F4] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 transform hover:scale-105 transition-all duration-300">
            <h1
              className="text-white text-3xl font-extrabold cursor-pointer font-[IBM Plex Mono]"
              onClick={() => navigate("/")}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 hover:italic transition-all duration-300">
                TechMart
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {token ? (
              <>
                {role === "admin" ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate("/admin")}
                      className="bg-white text-[#0056D2] hover:text-white hover:bg-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-blue-200 hover:border-white/40 hover:scale-105"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/admin/orders")}
                      className="bg-white text-[#0056D2] hover:text-white hover:bg-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-blue-200 hover:border-white/40 hover:scale-105"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => navigate("/products")}
                      className="bg-white text-[#0056D2] hover:text-white hover:bg-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-blue-200 hover:border-white/40 hover:scale-105"
                    >
                      Products
                    </button>
                    <button
                      onClick={() => navigate("/admin/add-product")}
                      className="bg-white text-[#0056D2] hover:text-white hover:bg-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-blue-200 hover:border-white/40 hover:scale-105"
                    >
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => navigate("/products")}
                      className="text-[#333333] hover:bg-[#F5F5F5] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-gray-300 hover:border-gray-400"
                    >
                      Products
                    </button>
                    <button
                      onClick={() => navigate("/cart")}
                      className="text-[#333333] hover:bg-[#F5F5F5] p-3 rounded-full transition-all duration-300 relative group"
                    >
                      <ShoppingCartIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white ">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => navigate("/OrderHistory")}
                      className="text-[#333333] hover:bg-[#F5F5F5] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-gray-300 hover:border-gray-400"
                    >
                      Order History
                    </button>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#0056D2] hover:bg-red-600 hover:text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50 hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-white/10 hover:bg-white/20 text-[#333333] px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 backdrop-blur-sm border border-gray-300 hover:border-gray-400"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#66C0F4] text-[#0056D2] hover:bg-[#6BAED6] px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-white/50"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
