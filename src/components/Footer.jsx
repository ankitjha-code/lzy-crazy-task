const Footer = () => {
  return (
    <footer className="w-full mt-6 bg-[#004896]">
      {/* Main Footer */}
      <div className="text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            {/* CarTradeTech GROUP */}
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold">Car</span>
                <span className="bg-white text-blue-900 rounded-full w-6 h-6 flex items-center justify-center mx-0.5 font-bold">
                  T
                </span>
                <span className="text-xl font-bold">radeTech</span>
              </div>
              <div className="text-xs text-center">GROUP</div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block h-16 w-px bg-white mx-4"></div>

            {/* OLX */}
            <div className="mb-4 md:mb-0">
              <span className="text-3xl font-bold">OLX</span>
            </div>

            {/* carwale */}
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="4" fill="white" />
                  <path
                    d="M5 12H8M19 12H16M8 12C8 13.6569 9.34315 15 11 15C12.6569 15 14 13.6569 14 12C14 10.3431 12.6569 9 11 9C9.34315 9 8 10.3431 8 12ZM16 12C16 13.6569 14.6569 15 13 15C11.3431 15 10 13.6569 10 12C10 10.3431 11.3431 9 13 9C14.6569 9 16 10.3431 16 12Z"
                    stroke="#0047AB"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-xl font-medium">carwale</span>
              </div>
            </div>

            {/* bikewale */}
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" fill="white" />
                  <path
                    d="M8 16L12 12M16 8L12 12M12 12L8 8M12 12L16 16"
                    stroke="#0047AB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xl font-medium">bikewale</span>
              </div>
            </div>

            {/* CarTrade */}
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-bold">Car</span>
                <span className="bg-white text-blue-900 rounded-full w-6 h-6 flex items-center justify-center mx-0.5 font-bold">
                  T
                </span>
                <span className="text-xl font-bold">rade</span>
              </div>
            </div>

            {/* MOBILITY OUTLOOK */}
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="24" height="24" rx="2" fill="white" />
                  <path d="M6 12H18M12 6V18" stroke="#0047AB" strokeWidth="2" />
                </svg>
                <div>
                  <div className="text-xs font-bold">MOBILITY</div>
                  <div className="text-xs font-bold">OUTLOOK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="py-2 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-xs">Sitemap</div>
            <div className="text-xs">
              Free Classifieds in India • © 2006-2025 OLX
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
