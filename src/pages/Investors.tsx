import React, { useState } from "react";

// The section with black background (`min-h-screen w-full bg-black`) will always be at least the height of the viewport due to `min-h-screen`.
// Having a fixed height on the <section> (`h-[538px]`) within it means the section's *content* is that height, but the parent div will never be less than 100vh.
// If you want the black background to decrease its height, you must remove or adjust `min-h-screen` on the wrapping <div>.

const Investors = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription logic here
    console.log("Email submitted:", email);
  };

  return (
    // Removed min-h-screen from the wrapper div so the black background height will decrease when content is less
    <div className="w-full bg-black font-sans">
      {/* Vision Section */}
      <section className="w-full relative overflow-hidden py-3 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Heading */}
              <div className="space-y-2">
                <div className="text-white text-sm md:text-base font-normal">Our</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                  Vision
                </h2>
              </div>

              {/* Main Vision Statement */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
                Automating delightful & safe investing experience for all.
              </h1>

              {/* Explanatory Paragraph */}
              <p className="text-[#19d94b] md:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
                Our philosophy, imagination & action is driven to bring automated trading, investing for all parts of society to enable every individual a chance to change their financial circumstances & invest smartly while advocating for stronger risk management.
              </p>
            </div>

            {/* Right Side - Geometric Shapes */}
            <div className="lg:col-span-1 relative h-100 md:h-80 lg:h-100 flex items-center justify-end pr-4">
              {/* Bright Blue Rectangle */}
              <div
                className="absolute bg-[#3b82f6] opacity-90 rounded transform lg:translate-x-10 lg:-translate-y-14 hidden lg:block"
                style={{
                  width: "150px",
                  height: "440px",
                  top: -70,
                  right: "32px",
                  zIndex: 10,
                }}
              ></div>
              {/* Dark Green Rectangle (should overlap blue, so higher zIndex) */}
              <div
                className="absolute bg-[#0a3d0a] opacity-90 rounded hidden lg:block"
                style={{
                  top: "20px",
                  right: "50px",
                  width: "180px",
                  height: "500px",
                  zIndex: 20,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section - White Background */}
      <section className="w-full bg-white py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-24">
            {/* Left Column - Our Mission */}
            <div className="space-y-6 md:space-y-8">
              {/* Heading */}
              <div className="space-y-2">
                <div className="text-black text-sm md:text-base font-normal">Our</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight">
                  Mission
                </h2>
              </div>

              {/* Mission Statement - Bold, larger font */}
              <p className="text-[#19d94b] text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed pl-2 md:pl-4 mt-4">
                Is to create & share new alpha/ edge trading and investing algorithmic strategies that focusses on high risk management while still being profitable.
              </p>

              {/* Approach Details - Regular, smaller font */}
              <p className="text-[#19d94b] text-base md:text-lg lg:text-xl font-normal leading-relaxed pl-2 md:pl-4 mt-4">
                Our approach is developed on market research, psychology, behavior and data based dimensions to create these algorithms. We look at amalgamation of technical analysis, fundamental market cycles and alternative data to create new ideologies in trading strategies.
              </p>
            </div>

            {/* Right Column - Our Values */}
            <div className="space-y-6 md:space-y-8">
              {/* Heading */}
              <div className="space-y-2">
                <div className="text-black text-sm md:text-base font-normal">Our</div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight">
                  Values
                </h2>
              </div>

              {/* Core Values List - Bold, larger font */}
              <p className="text-[#19d94b] text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed pl-2 md:pl-4 mt-4">
                Include honesty & integrity, respect to every individual, passion to achieve & desire, never giving up, long term thinking & reflection, radical openness, transparency & acceptance builds a critical emotional & fundamental difference in the way of our culture & providing value to our users.
              </p>

              {/* Fintech Philosophy - Regular, smaller font */}
              <p className="text-[#19d94b] text-base md:text-lg lg:text-xl font-normal leading-relaxed pl-2 md:pl-4 mt-4">
                Building a great fintech in today's era of misinformation, unethical actors & bad-faith is difficult. We believe in values that make us fair & an equitable entity to create a difference, have a positive outcome to deliver high value to individuals who put faith in us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch-deck Section - Dark Green Background */}
      <section className="w-full bg-[#0a3d0a] py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="space-y-6 md:space-y-8">
            {/* Main Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Pitch-deck for interested investors
            </h2>

            {/* Download Pitch-deck Link */}
            <div className="space-y-2">
              <a 
                href="#" 
                className="text-[#19d94b] text-xl md:text-2xl lg:text-3xl font-bold hover:underline inline-block"
              >
                Download Pitch-deck (PDF)
              </a>
              
              {/* Update Note */}
              <p className="text-white text-sm md:text-base italic">
                *Last updated: September 2025
              </p>
            </div>

            {/* Request Business Plan Link */}
            <div className="pt-4">
              <a 
                href="#" 
                className="text-[#13b53e] text-xl md:text-2xl lg:text-3xl font-bold hover:underline inline-block"
              >
                Request Business Plan (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white flex items-center justify-center py-4">
      {/* <span className="text-gray-500 text-base md:text-lg">Placeholder media of our system</span> */}
      </section>
      {/* New Fund Offering Section - Black Background */}
      <section className="w-full bg-black py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="space-y-6 md:space-y-8">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              New Fund Offering - Quantinfinium Hamster Fund (Coming soon)
            </h2>

            {/* First Paragraph - Green Text */}
            <p className="text-[#19d94b] text-base md:text-lg lg:text-xl font-normal leading-relaxed">
              We believe in long term commitment to investing without short term fluctuations, market manipulation & misdirections.
            </p>

            {/* Second Paragraph - Green Text */}
            <p className="text-[#19d94b] text-base md:text-lg lg:text-xl font-normal leading-relaxed">
              Our NFO - QIHMSTR Fund is a single dynamic proprietary fund that focusses on wealth building, while ensuring risks are sustainable when macro-micro markets go haywire.
            </p>

            {/* Call to Action */}
            <p className="text-white text-base md:text-lg lg:text-xl font-normal pt-4">
              Subscribe for updates below.
            </p>

            {/* Email Input Form */}
            <form onSubmit={handleSubmit} className="pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@email.com"
                className="w-full max-w-md px-4 py-3 bg-transparent border border-white text-white placeholder:text-white/70 focus:outline-none focus:border-[#19d94b] transition-colors"
              />
            </form>
          </div>
        </div>
      </section>

      <section className="w-full bg-white flex items-center justify-center py-4">
      {/* <span className="text-gray-500 text-base md:text-lg">Placeholder media of our system</span> */}
      </section>
      {/* Placeholder Section - Dark Green Background */}
      <section className="w-full bg-[#0a3d0a] py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="space-y-6 md:space-y-8">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Placeholder Section
            </h2>

            {/* Placeholder Text - Multiple Lines */}
            <p className="text-[#19d94b] text-base md:text-lg lg:text-xl font-normal leading-relaxed">
              Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts Placeholder texts
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Investors;
