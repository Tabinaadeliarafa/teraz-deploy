import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "@inertiajs/react";

const colors = {
  primary: "#C97856",
  secondary: "#A8B89A",
  background: "#2C2420",
  text: "#F5F2EE",
  textMuted: "#E5E5E5",
  accent: "#E8D5C4",
};

const HeroSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-x-hidden font-sans scroll-mt-28"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-50"
           style={{ backgroundImage: "url(/teraZ/background.png)" }} />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${colors.background}f5 0%, ${colors.background}dd 30%, ${colors.background}88 60%, ${colors.background}44 100%)`,
        }}
      />

      {/* NAV */}
      <div
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: isScrolled ? colors.background : "transparent",
        }}
      >
        <Navbar />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center pt-24 md:pt-28">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 w-full">
          <div className="max-w-4xl">
            
            {/* TITLE + LOGO */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
                <h1
                  className="font-bold tracking-tight 
                  text-[2.2rem] sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl leading-none"
                  style={{ color: colors.text }}
                >
                  Arzeta
                </h1>

                <div
                  className="transform rotate-12 rounded-full overflow-hidden flex-shrink-0
                  w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36"
                >
                  <img
                    src="/teraZ/logo.png"
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2
                className="font-bold tracking-tight leading-none
                text-xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl 
                -mt-1 sm:-mt-2 md:-mt-4"
                style={{ color: colors.secondary }}
              >
                Co – Living
              </h2>
            </div>

            {/* HEADLINE */}
            <p
              className="font-medium leading-relaxed mb-2
              text-sm sm:text-base md:text-lg lg:text-2xl"
              style={{ color: colors.text }}
            >
              Cari kost muslimah yang nyaman & strategis di Surabaya?
            </p>

            {/* DESCRIPTION */}
            <p
              className="leading-relaxed max-w-2xl
              text-xs sm:text-sm md:text-base mb-6 md:mb-8"
              style={{ color: colors.textMuted }}
            >
              Kami hadir dengan kamar nyaman, lingkungan bersih, dan lokasi
              super strategis yang dekat dengan kampus.
            </p>

            {/* CTA BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/login"
                className="rounded-lg text-center font-semibold transition-all hover:scale-105
                px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.text,
                }}
              >
                Login
              </Link>

              <a
                href="#contact"
                className="rounded-lg text-center font-semibold transition-all hover:scale-105
                px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-14 md:mt-20 pb-12">
          <div className="px-8 sm:px-12 md:px-16 lg:px-24">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto text-center">
              
              <div className="px-2">
                <h4 
                  className="font-bold mb-1 text-[11px] sm:text-sm md:text-lg"
                  style={{ color: colors.text }}
                >
                  Lokasi Strategis
                </h4>
                <p
                  className="text-[10px] sm:text-xs"
                  style={{ color: colors.textMuted }}
                >
                  Dekat UPN & UT
                </p>
              </div>

              <div className="px-2">
                <h4 
                  className="font-bold mb-1 text-[11px] sm:text-sm md:text-lg"
                  style={{ color: colors.text }}
                >
                  Fasilitas Lengkap
                </h4>
                <p
                  className="text-[10px] sm:text-xs"
                  style={{ color: colors.textMuted }}
                >
                  Menunjang kenyamanan
                </p>
              </div>

              <div className="px-2">
                <h4
                  className="font-bold mb-1 text-[11px] sm:text-sm md:text-lg"
                  style={{ color: colors.text }}
                >
                  Harga Terjangkau
                </h4>
                <p
                  className="text-[10px] sm:text-xs"
                  style={{ color: colors.textMuted }}
                >
                  Dengan kualitas premium
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;