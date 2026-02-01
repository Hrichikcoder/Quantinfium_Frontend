import React from "react";

const Footer = () => (
  <footer className="w-full bg-white py-10 md:py-12">
    <div className="w-full max-w-7xl mx-auto px-8 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-6 md:gap-24 lg:gap-32 xl:gap-40">
        {/* Left Section - Disclaimer */}
        <div className="flex-shrink-0 md:w-[40%] lg:w-[45%]">
          <p className="text-black text-[14px] leading-[21px] font-normal font-sans">
            Note: Maekmybots does not provide stock tips, investment
            advice, or guaranteed returns. Our platform is designed for
            speculation, practice, and systematic trading tools. We have
            not authorized any individual, partner, or associate to offer
            such services on our behalf.
          </p>
        </div>

        {/* Right Section - Two Columns of Links */}
        <div className="flex flex-row gap-12 md:gap-14 lg:gap-16 flex-shrink-0">
          {/* Column 1 */}
          <div className="flex flex-col gap-2.5 md:gap-3">
            <a href="#" className="text-black text-[15px] md:text-[16px] font-normal font-sans hover:underline">
              For Investors
            </a>
            <a href="#" className="text-black text-[15px] md:text-[16px] font-normal font-sans hover:underline">
              Privacy Notice
            </a>
            <a href="#" className="text-black text-[15px] md:text-[16px] font-normal font-sans hover:underline">
              Disclosures
            </a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2.5 md:gap-3">
            <a href="#" className="text-black text-[15px] md:text-[16px] font-normal font-sans hover:underline">
              Support
            </a>
            <a href="#" className="text-black text-[15px] md:text-[16px] font-normal font-sans hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-black text-[15px] md:text-[16px] font-normal font-sans hover:underline">
              Pricing & subscriptions
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 