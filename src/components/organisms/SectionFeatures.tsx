import React from "react";

interface SectionFeaturesProps {
  onSignUpClick: () => void;
  outlineBtn: string;
  filledBtn: string;
}

const SectionFeatures: React.FC<SectionFeaturesProps> = ({ onSignUpClick, outlineBtn, filledBtn }) => (
  <>
    {/* Black/Green Gradient Section */}
    {/* <section
      className="w-full"
      style={{ background: "linear-gradient(120deg, #000000 60%, #006600 100%)" }}
    >
       
      <div className="w-full flex flex-row items-center justify-center py-8 md:py-12 px-4 md:px-0 text-center gap-6">
        <div className="hidden md:flex -translate-x-[200px] flex-shrink-0 items-center justify-center h-full">
          <img
            src="/noun-star.svg"
            alt=""
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
            style={{
              filter: "drop-shadow(0 0 12px #35ec2c80)",
            }}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto md:mx-20">
          <p className="text-white text-base md:text-3xl font-light mb-6 mx-auto">
            Build strategies, test signals, deploy bots & benchmark performances, all in one single space.
          </p>
          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <button onClick={onSignUpClick} className={outlineBtn}>
              Sign up now
            </button>
            <button className={filledBtn}>View performance</button>
          </div>
        </div>
      </div>
       
    </section> */}

    {/* Placeholder Media Section 1 */}
    <section className="w-full bg-black flex items-center justify-center py-1">
      {/* <span className="text-gray-500 text-base md:text-lg">Placeholder media of our system</span> */}
    </section>

    {/* Blue/Black Gradient Section - Intuitiveness with Simplicity */}
    <section
      className="w-full"
      style={{ background: "linear-gradient(120deg, #001033 0%, #003366 40%, #000000 100%)" }}
    >
      <div className="w-full max-w-8xl mx-auto flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 text-center">
        {/* Main Heading */}
        <h2 className="text-white text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight text-center">
          Intuitiveness & Speed.
        </h2>

        {/* Description */}
        <div className="w-full max-w-4xl mx-auto px-4">
          <p className="text-white text-base sm:text-lg md:text-xl font-normal mb-6 sm:mb-8 text-center max-w-2xl mx-auto leading-relaxed px-2">
            Deploy bots using simple plain English or any other language of choice.
            From basic to sophisticated configurations, all customizable.
            {/* Beginners can create and deploy bots with simple English language & or other languages without having to worry about complicating your bot configurations. Advance users can edit the configuration & add even more power to their bots. */}
          </p>

          {/* Bot Configuration Demo Section */}
          <div className="w-full flex flex-col items-center">
            {/* Input/Prompt Box */}
            <div className="relative border border-green-400 rounded-lg p-3 sm:p-4 md:p-6 bg-black/20 backdrop-blur-sm mb-4 md:mb-6 w-full max-w-2xl mx-auto">
              <div className="text-white text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                I want a bot that buys 500 $ of SP500 Index every week. It should buy when the fear & greed index signals buy and should sell 5% of my invested capital when the Fear & Greed index is overheated.
              </div>
              {/* Action Icon */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-black/50 rounded-full flex items-center justify-center">
                <span className="mb-1">
                  <svg width={24} height={24} viewBox="0 0 38 38" fill="none" className="text-white opacity-90 sm:w-[38px] sm:h-[38px]" xmlns="http://www.w3.org/2000/svg">
                    {/* Arrow shaft */}
                    <line x1="10" y1="19" x2="26" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Arrow head */}
                    <polyline points="19,12 26,19 19,26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
                {/* <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg> */}
              </div>
            </div>

            {/* Progress Status */}
            <div className="text-white text-xs sm:text-sm font-normal mb-4 md:mb-6 opacity-80 w-full max-w-2xl mx-auto text-center px-2">
              Bot creation begining... 0.02seconds, bot infrastructure created, applying configuration...0.08 seconds Bot ready to be deployed....0.01 seconds
            </div>

            {/* Completion Status and Action Buttons */}
            <div className="relative w-full flex justify-center">
              <div
                className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 mb-5 md:mb-8 w-full max-w-2xl"
                style={{
                  borderRadius: '10px',
                  borderBottom: '1.5px solid rgba(255,255,255,0.36)',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.26) 60%, rgba(0,0,0,0.03) 100%)',
                  boxShadow: '0 12px 52px 0 rgba(0,0,0,0.12)',
                  backdropFilter: 'blur(3px)',
                }}
              >
                <div className="flex justify-center items-center w-full">
                  {/* Arrow on the left */}
                  <div className="flex flex-col items-center mr-2 sm:mr-4 flex-shrink-0">
                    <span className="mb-1">
                      <svg width={28} height={28} viewBox="0 0 38 38" fill="none" className="text-white opacity-90 sm:w-[38px] sm:h-[38px]" xmlns="http://www.w3.org/2000/svg">
                        {/* Arrow shaft */}
                        <line x1="10" y1="19" x2="26" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Arrow head */}
                        <polyline points="19,12 26,19 19,26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                    <span className="block w-8 sm:w-10 h-3 border-b border-white/30 -mt-1" />
                  </div>
                  {/* Content section with left aligned text */}
                  <div className="flex flex-col justify-center items-start flex-1 min-w-0">
                    <span className="text-white text-sm sm:text-base font-semibold leading-5 mb-0.5" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      Qi has completed the bot config process.
                    </span>
                    <span className="text-green-200 text-sm sm:text-base font-normal leading-5 mb-2 sm:mb-3">
                      What would you like to do?
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-white/70 text-white bg-transparent rounded text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors shadow">
                        View config
                      </button>
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-black rounded text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors shadow">
                        Deploy now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="flex flex-col items-center justify-center text-white text-base sm:text-lg md:text-xl font-normal mb-8 text-center max-w-lg mx-auto leading-relaxed px-2">
              <span className="font-medium">
                Plus you can also build strategies, test signals &
                benchmark portfolio performances on our platform
              </span>
            </p>

            {/* Main CTA Button */}
            <div className="flex justify-center mb-2 mt-2 w-full px-4">
              <button className="px-8 sm:px-12 md:px-16 lg:px-20 py-2 border border-blue-300 text-white bg-transparent rounded-3xl text-base sm:text-lg md:text-xl font-bold hover:bg-blue-300/10 transition-colors w-full max-w-sm">
                Try now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Placeholder Media Section 2 */}
    <section className="w-full bg-black flex items-center justify-center py-1">
      {/* <span className="text-gray-500 text-base md:text-lg">Placeholder media of our system</span> */}
    </section>

    {/* Black/Green Gradient Section - Clean & Clear */}
    <section
      className="w-full relative overflow-hidden"
      style={{ background: "linear-gradient(120deg, #000000 60%, #006600 100%)" }}
    >
      {/* Coin Image - Positioned absolutely to the left, outside container - Hidden on small screens */}
      <div className="hidden md:block absolute left-4 md:left-8 lg:left-12 xl:left-16 top-16 md:top-20 flex items-center justify-center z-10">
        <img
          src="/image-coin-2.png"
          alt=""
          className="w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48 object-contain opacity-80"
          style={{ animation: 'pulse 9s infinite' }}
        />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-16 md:py-20 px-4 sm:px-6 md:px-8 text-center">
        {/* Top Section with Icon and Heading */}
        <div className="flex flex-col items-center gap-4 mb-8 sm:mb-12">
          {/* Heading */}
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-center">
            Clean & clear
          </h2>
          <p className="text-white text-base sm:text-lg md:text-2xl lg:text-4xl font-normal text-center max-w-3xl mx-auto leading-relaxed px-2">
            user-experience, don't miss out on risk management for all your investments.
          </p>
        </div>

        {/* Bot Cards Grid - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-6xl mb-12 justify-center">
          {/* Left Card - Dollar Cost Average Bots (Large Vertical) */}
          <div
            className="w-full lg:w-[32.666667%] rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 relative flex flex-col justify-between"
            style={{
              background: "#065f46",
            }}
          >
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex justify-between items-start mb-4 sm:mb-5 lg:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="bg-green-300 text-black text-xs font-medium px-2 sm:px-3 py-1 rounded">Beta</span>
                  <span className="text-white text-xs sm:text-sm font-medium">Most popular*</span>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="mb-1">
                    <svg width={24} height={24} viewBox="0 0 38 38" fill="none" className="text-black opacity-90 sm:w-[38px] sm:h-[38px]" xmlns="http://www.w3.org/2000/svg">
                      {/* Arrow shaft */}
                      <line x1="10" y1="19" x2="26" y2="19" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Arrow head */}
                      <polyline points="19,12 26,19 19,26" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="mb-6 sm:mb-8 lg:mb-10 flex-1 flex flex-col justify-center min-h-0">
                {/* Mobile: Compact single-line, Desktop: Stacked */}
                <div className="flex flex-col items-start space-y-1 lg:space-y-2 xl:space-y-3">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold leading-tight lg:leading-[1.15]">
                    <span className="hidden lg:block">Dollar</span>
                    <span className="hidden lg:block">Cost</span>
                    <span className="hidden lg:block">Average</span>
                    <span className="hidden lg:block">Bots</span>
                    <span className="lg:hidden leading-snug">Dollar Cost Average Bots</span>
                  </h3>
                </div>
                <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mt-4 sm:mt-5 lg:mt-6 xl:mt-7">Basic, smart & advance*</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 lg:mt-auto flex justify-center items-center w-full">
              <button className="bg-black text-white border border-white px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-1.5 sm:py-2 md:py-2.5 rounded-3xl text-xs sm:text-sm font-medium hover:bg-white hover:text-black transition-colors w-full sm:w-auto">
                Create DCA Bot
              </button>
            </div>
          </div>

          {/* Right Side - Two Stacked Cards */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 sm:gap-6">
            {/* Top-Right Card - Trade Bots Investing Bots */}
            <div className="relative rounded-lg p-4 sm:p-6 overflow-hidden min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex-1 flex flex-col">
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom center, #ff6b35 0%, #8B5CF6 50%, #3B82F6 100%)" }}></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-green-300 text-black text-xs font-medium px-2 py-1 rounded mb-2 sm:mb-3 block w-fit">Beta</span>
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-white text-lg sm:text-xl lg:text-[24px] font-extrabold leading-tight">Trade Bots</h3>
                      <h3 className="text-white text-lg sm:text-xl lg:text-[24px] font-extrabold leading-tight">Investing Bots</h3>
                    </div>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="mb-1">
                      <svg width={24} height={24} viewBox="0 0 38 38" fill="none" className="text-black opacity-90 sm:w-[38px] sm:h-[38px]" xmlns="http://www.w3.org/2000/svg">
                        {/* Arrow shaft */}
                        <line x1="10" y1="19" x2="26" y2="19" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Arrow head */}
                        <polyline points="19,12 26,19 19,26" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center w-full h-full">
                  <button className="bg-black text-white border border-white px-8 sm:px-10 md:px-12 py-1.5 sm:py-2 rounded-3xl text-xs sm:text-sm font-medium hover:bg-white hover:text-black transition-colors">
                    Deploy now
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom-Right Card - Powerful Portfolio & Rebalancer Bots */}
            <div className="relative rounded-lg p-4 sm:p-6 overflow-hidden min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex-1 flex flex-col">
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at bottom center, #7c3aed 0%, #4c1d95 50%, #1f2937 100%)" }}></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-green-300 text-black text-xs font-medium px-2 py-1 rounded mb-2 sm:mb-3 block w-fit">Beta</span>
                    <div className="flex flex-col items-start text-left">
                      <h3 className="text-white text-lg sm:text-xl lg:text-[24px] font-extrabold leading-tight">Powerful</h3>
                      <h3 className="text-white text-lg sm:text-xl lg:text-[24px] font-extrabold leading-tight">Portfolio & Rebalancer</h3>
                      <h3 className="text-white text-lg sm:text-xl lg:text-[24px] font-extrabold leading-tight">Bots</h3>
                    </div>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="mb-1">
                      <svg width={24} height={24} viewBox="0 0 38 38" fill="none" className="text-black opacity-90 sm:w-[38px] sm:h-[38px]" xmlns="http://www.w3.org/2000/svg">
                        {/* Arrow shaft */}
                        <line x1="10" y1="19" x2="26" y2="19" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Arrow head */}
                        <polyline points="19,12 26,19 19,26" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="mt-auto flex justify-center items-center w-full h-full">
                  <button className="bg-black text-white border border-white px-8 sm:px-10 md:px-12 py-1.5 sm:py-2 rounded-3xl text-xs sm:text-sm font-medium hover:bg-white hover:text-black transition-colors">
                    Deploy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full text-center">

          <p className="text-white text-sm sm:text-base md:text-[25px] font-normal mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed text-center">
            <span className="font-medium my-4 block">Thinking short term?  Trade bots on your service! </span>
            <span className="font-medium my-4 block">Powerful risk-managed portfolio bots are perfect </span>
            <span className="font-medium my-4 block">for those with long term wealth building goals!</span>
            {/* Short term scalper, then choose trade bots,<br /><br/>
            long term investor then, choose portfolio bots.<br /><br/>
            <b style={{ whiteSpace: "nowrap" }}>We offer wide range of bot for every user type.</b> */}
          </p>

          <button className="bg-black text-white border border-white px-8 sm:px-12 md:px-16 lg:px-20 py-2 sm:py-2.5 rounded-3xl text-sm sm:text-base md:text-lg lg:text-2xl font-bold hover:bg-white hover:text-black transition-colors">
            Go to dashboard
          </button>
        </div>
      </div>
    </section>
  </>
);

export default SectionFeatures;