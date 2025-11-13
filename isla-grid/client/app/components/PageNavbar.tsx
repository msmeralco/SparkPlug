'use client';

import { useEffect, useState } from 'react';

const PageNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const linkColorClass = hasScrolled
    ? 'text-gray-700 hover:text-[#FC7019]'
    : 'text-white hover:text-white/80';

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        hasScrolled ? 'bg-[#FFFDFA]/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-nowrap justify-between items-center ">
          <a
            href="#"
            className={`text-3xl font-extrabold whitespace-nowrap transition-colors duration-300 ${
              hasScrolled ? 'text-[#131B28]' : 'text-white'
            }`}
          >
            <span className="text-[#FC7019]">Isla</span>Grid
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:flex-nowrap items-center space-x-8">
             <a
               href="#problem"
               className={`${linkColorClass} font-medium whitespace-nowrap transition-colors duration-200`}
             >
               The Problem
             </a>
             <a
               href="#solution"
               className={`${linkColorClass} font-medium whitespace-nowrap transition-colors duration-200`}
             >
               Solution
             </a>
             <a
               href="#about"
               className={`${linkColorClass} font-medium whitespace-nowrap transition-colors duration-200`}
             >
               About Us
             </a>
             <a
               href="#features"
               className={`${linkColorClass} font-medium whitespace-nowrap transition-colors duration-200`}
             >
               How It Works
             </a>
             <a
               href="#contact"
               className="bg-[#FC7019] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:brightness-95 transition-all shrink-0 whitespace-nowrap"
             >
               Get Started
             </a>
           </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden focus:outline-none transition-colors duration-200 ${
              hasScrolled ? 'text-gray-700 hover:text-[#FC7019]' : 'text-white hover:text-white/80'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4 pb-2">
            <a
              href="#problem"
              onClick={closeMenu}
              className={`${linkColorClass} font-medium py-2 transition-colors duration-200`}
            >
              The Problem
            </a>
            <a
              href="#solution"
              onClick={closeMenu}
              className={`${linkColorClass} font-medium py-2 transition-colors duration-200`}
            >
              IslaGrid Solution
            </a>
            <a
              href="#about"
              onClick={closeMenu}
              className={`${linkColorClass} font-medium py-2 transition-colors duration-200`}
            >
              About Us
            </a>
            <a
              href="#features"
              onClick={closeMenu}
              className={`${linkColorClass} font-medium py-2 transition-colors duration-200`}
            >
              How It Works
            </a>
            <a
              href="#contact"
              onClick={closeMenu}
              className="bg-[#FC7019] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:brightness-95 transition-all text-center"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PageNavbar;