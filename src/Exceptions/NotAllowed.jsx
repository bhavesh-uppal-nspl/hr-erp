import { ShieldX, Home, Lock, ArrowLeft } from "lucide-react";

const NotAllowed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="max-w-2xl w-full z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center transform hover:scale-105 transition-transform duration-300">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-6 shadow-xl">
                <ShieldX className="w-16 h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-pulse">
            403
          </h1>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg mb-3 max-w-md mx-auto">
            You don't have permission to access this resource.
          </p>
          <p className="text-gray-500 mb-8">
            If you believe this is an error, please contact support.
          </p>

          {/* Decorative Lock Icons */}
          <div className="flex justify-center gap-4 mb-8">
            <Lock className="w-6 h-6 text-blue-300 animate-bounce" style={{ animationDelay: "0s" }} />
            <Lock className="w-6 h-6 text-indigo-300 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <Lock className="w-6 h-6 text-blue-300 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transform hover:-translate-y-1 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Error Code: <span className="font-mono font-semibold text-blue-600">ERR_FORBIDDEN</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAllowed;