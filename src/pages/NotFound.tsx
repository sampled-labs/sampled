import React from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/shared/Header";
import { Footer } from "../components/landing/Footer";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white font-sequel">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-6xl md:text-8xl font-bold font-pixter text-primary mb-4 tracking-wider">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-grey-200">
          Page Not Found
        </h2>
        <p className="text-grey-400 max-w-md mb-8 text-sm md:text-base leading-relaxed">
          The sample, collection, or destination you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-black font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-primary/20"
        >
          Return to Explore
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
