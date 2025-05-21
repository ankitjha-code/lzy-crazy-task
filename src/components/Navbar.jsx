import React from "react";
import { IoArrowBack } from "react-icons/io5";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gray-50 shadow-sm p-4">
      <button className="p-1 cursor-pointer">
        <IoArrowBack className="text-black" size={24} />
      </button>
    </header>
  );
};

export default Navbar;
