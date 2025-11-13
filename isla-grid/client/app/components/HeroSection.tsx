import Image from "next/image";

const HeroSection = () => (
  <header className="relative h-screen min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
    {/* Background Image */}
    <Image
      src="/hero-bg.jpg"
      alt="Renewable energy background"
      fill
      style={{ objectFit: "cover", objectPosition: "center" }}
      priority
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-black/50 z-10" />
    {/* Content */}
    <div className="container mx-auto px-6 relative z-20">
      <h1 className="text-5xl md:text-7xl font-extrabold text-shadow leading-tight">
        Introducing <span className="text-[#FC7019]">IslaGrid</span>
      </h1>
      <p className="mt-4 text-xl md:text-2xl max-w-3xl mx-auto text-shadow font-light">
        A community-driven approach to harness the Philippines renewable
        energy, built by SparkPlug.
      </p>
      <a
        href="#solution"
        className="mt-10 inline-block bg-[#FC7019] text-white px-10 py-4 rounded-lg text-lg font-semibold shadow-xl hover:brightness-95 transition-all transform hover:-translate-y-1"
      >
        Discover The Future of Energy
      </a>
    </div>
  </header>
);

export default HeroSection;
