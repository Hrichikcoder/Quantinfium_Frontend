import React from "react";

const SectionHero = () => (
  <section
    className="w-full relative overflow-hidden"
    style={{ background: "linear-gradient(120deg, #000d00 0%, #006600 60%, #00ff66 100%)" }}
  >
    {/* Decorative SVG elements */}
    <img
      src="/image-planet.png"
      alt=""
      className="absolute top-10 right-10 md:right-20 w-32 md:w-48 opacity-30 animate-pulse"
      style={{ animationDuration: '8s' }}
      
    />
    <img
      src="/noun-star.svg"
      alt=""
      className="absolute bottom-10 left-10 md:left-20 w-20 md:w-32 opacity-20 animate-pulse"
      style={{ animationDuration: '6s' }}
    />
    <img
      src="/image-coin-1.png"
      alt=""
      className="absolute top-1/4 left-5 w-16 md:w-24 opacity-80 animate-pulse"
      style={{ animationDuration: '7s' }}
    />
    <img
      src="/image-coin-2.png"
      alt=""
      className="absolute bottom-1/4 right-5 w-16 md:w-24 opacity-80 animate-pulse"
      style={{ animationDuration: '9s' }}
    />
    
    {/* Main content container adjusted for more centered text and button */}
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center py-23 md:py-32 px-8 md:px-8 relative z-10">
      
      {/* Text content container */}
      <div className="text-left w-full md:w-3/4 lg:w-2/3 mb-8">
  <h1
    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
    style={{ textShadow: "0 2px 16px rgba(0,0,0,0.18)" }}
  >
    Automated Investing<br />Made delightful<br />& simple.
  </h1>
  <p className="text-white text-lg md:text-xl font-light leading-relaxed">
    <span className="font-bold">
      with our platform, your money works as hard as you!
    <br />
    From short-term savings, to long-term retirement<br />
    planning or anything in between, we have got it all covered.
    </span>
  </p>
</div>

      {/* Call to action button container */}
  <div className="w-full md:w-3/4 lg:w-2/3 flex justify-start items-center">
  <a
    href="#"
    className="bg-white text-green-600 font-semibold py-3 px-16 rounded-full text-lg shadow-md border border-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
  >
    Sign up
  </a>
</div>

    </div>
  </section>
);

export default SectionHero;