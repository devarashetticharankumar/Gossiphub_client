import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
      setIsLoading(false);
    }, 1000); // Delay for better UX
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 animate-fade-in-down">
          See You Soon!
        </h2>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            isLoading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 hover:shadow-lg"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span>Logging out...</span>
            </>
          ) : (
            <span>Logout</span>
          )}
        </button>
        <p className="mt-6 text-center text-gray-600">
          Want to stay?{" "}
          <a
            href="/"
            className="text-indigo-500 font-medium hover:text-indigo-700 transition-colors duration-300"
          >
            Go back
          </a>
        </p>
      </div>
    </div>
  );
};

export default Logout;
