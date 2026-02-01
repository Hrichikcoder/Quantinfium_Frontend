import React from "react";

const SectionHero = () => (
  <section
    className="w-full relative overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24"
    style={{ background: "linear-gradient(130deg, #000d00 10%, #045104ff 60%)" }}
  >
    {/* Decorative SVG elements - Much larger and more prominent */}
    <img
      src="/SvgFinal.svg"
      alt=""
      className="absolute top-1/2 right-2 sm:right-4 md:right-8 lg:right-12 xl:right-16 w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] opacity-100 transform -translate-y-1/2 z-5"
      style={{ 
        animationDuration: '8s',
        filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))'
      }}
    />
    
    <img
      src="/image-coin-1.png"
      alt=""
      className="absolute top-1/4 -translate-x-1/4 w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28 opacity-100 z-10"
      style={{ 
        animationDuration: '7s',
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
      }}
    />
    
    {/* Main content container */}
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
      
      {/* Mobile Layout */}
      <div className="md:hidden text-center">
        <h1
          className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.18)" }}
        >
          <span className="whitespace-nowrap">Automated Investing </span><br />made delightful<br />& simple.
        </h1>
        <a
          href="#"
          className="inline-block bg-white text-green-600 font-semibold py-3 px-8 rounded-full text-base shadow-md border border-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300 mb-6"
        >
          Sign up Now
        </a>
        <p className="text-white text-xl sm:text-2xl font-thin leading-relaxed mb-8 text-center">
          <span className="block">with our platform, your money works as hard as you!</span>
          <span className="block">From short-term savings, to long-term retirement</span>
          <span className="block">planning or anything in between, we have got it all covered.</span>
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col items-center justify-center text-center">
        {/* Heading with wider container - breaks out of padding */}
        <div className="w-full mb-6 px-2 md:px-4 lg:px-8">
          <h1
            className="text-4xl lg:text-5xl xl:text-8xl text-white font-bold leading-tight"
            style={{
              textShadow: "0 2px 16px rgba(0,0,0,0.18)"
            }}
          >
            <span className="">Automated Investing </span>
            <span className="block">made delightful </span>
            <span className="">& simple.</span>
          </h1>
        </div>
        
        {/* Button container with padding */}
        <div className="w-full max-w-4xl mx-auto px-5 md:px-10 xl:px-20 mb-8 mt-10">
          {/* Button centered below text */}
          <div className="flex justify-center">
            <a
              href="#"
              className="bg-white text-green-600 font-semibold py-3 px-12 rounded-full text-lg shadow-md border border-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
            >
              Sign up Now
            </a>
          </div>
        </div>
        
        {/* Paragraph with wider container - breaks out of padding */}
        <div className="w-full mb-8 px-2 md:px-4 lg:px-8">
          <p
            className="text-white font-thin leading-relaxed text-center"
            style={{ fontSize: "28px" }} // replaces text-xl
          >
            <span className="">With our platform, your money works as hard as you!</span>
            <span className="">From short-term savings, to long-term retirement</span>
            <span className="">planning or anything in between, we have got it all covered.</span>
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default SectionHero;