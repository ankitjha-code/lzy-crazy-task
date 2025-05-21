import React from "react";
import { IoArrowBack } from "react-icons/io5";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-[#002F3408] pt-2 pb-2 pl-4 pr-4 flex items-center justify-between shadow">
      <div className="w-12 h-12 flex items-center justify-center">
        <IoArrowBack className="w-6 h-6" />
      </div>
      <div className="h-12 pl-10"></div>
    </div>
  );
};

export default Navbar;
