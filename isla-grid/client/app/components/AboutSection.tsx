const AboutSection = () => (
  <section id="about" className="py-24 bg-[#FFFDFA]">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase text-[#FC7019] tracking-widest">
          About SparkPlug
        </h2>
        <p className="mt-3 text-4xl md:text-5xl font-extrabold text-[#131B28]">
          The Team Behind the Spark
        </p>
        <p className="mt-6 text-lg text-gray-700 leading-relaxed">
          SparkPlug isn't just a company; we're a dedicated team of engineers,
          community advocates, and sustainability experts. We believe that the
          future of energy in the Philippines is not just renewable, but also
          community-owned. We're passionate about building the tools to make
          that future a reality.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 gap-8">
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="bg-orange-100 text-[#FC7019] w-12 h-12 rounded-full flex items-center justify-center">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4l.01.01M12 16l.01.01M12 12l.01.01M12 8l.01.01M6 20h12a1 1 0 001-1V9a1 1 0 00-1-1H6a1 1 0 00-1 1v10a1 1 0 001 1z"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-2xl font-bold text-[#131B28]">
            Our Mission
          </h3>
          <p className="mt-2 text-gray-700 leading-relaxed">
            To provide Filipino communities with the technology and framework to
            harness their local renewable resources, turning shared geography
            into shared prosperity and energy independence.
          </p>
        </div>
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12c0 4.418-4.03 8-9 8S3 16.418 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="mt-5 text-2xl font-bold text-[#131B28]">Our Vision</h3>
          <p className="mt-2 text-gray-700 leading-relaxed">
            A sustainable and equitable Philippines where every household, barangay, big or
            small, runs on clean energy that is owned, managed, and benefits the
            community itself.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
