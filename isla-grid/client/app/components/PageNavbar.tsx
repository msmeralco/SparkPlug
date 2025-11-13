const PageNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-[#FFFDFA]/90 backdrop-blur-md shadow-sm z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <a href="#" className="text-3xl font-extrabold text-[#131B28]">
        <span className="text-[#FC7019]">Spark</span>Plug
      </a>
      <div className="hidden md:flex space-x-8">
        <a
          href="#problem"
          className="text-gray-700 hover:text-[#FC7019] font-medium"
        >
          The Problem
        </a>
        <a
          href="#solution"
          className="text-gray-700 hover:text-[#FC7019] font-medium"
        >
          IslaGrid Solution
        </a>
        <a
          href="#about"
          className="text-gray-700 hover:text-[#FC7019] font-medium"
        >
          About Us
        </a>
        <a
          href="#features"
          className="text-gray-700 hover:text-[#FC7019] font-medium"
        >
          How It Works
        </a>
        <a
          href="#contact"
          className="bg-[#FC7019] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:brightness-95 transition-all"
        >
          Get Started
        </a>
      </div>
      <div className="md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </div>
    </div>
  </nav>
);

export default PageNavbar;
