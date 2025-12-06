import React from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  subtitle: string;
  avatar: string;
  text: string;
  bgColor: string;
}

interface TestimonialCardProps {
  item: Review;
  rotate: string;
}

const TestimonialsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Shervina",
      subtitle: "Mahasiswi",
      avatar: "/teraZ/testi1.png",
      text: "Aku betah banget di sini karena fasilitasnya lengkap, semuanya serba digital. Bayar kos juga gampang, cukup lewat web. Cocok buat anak kuliahan yang nggak mau ribet.",
      bgColor: "bg-[#414833]",
    },
    {
      id: 2,
      name: "Reghina",
      subtitle: "Mahasiswi",
      avatar: "/teraZ/testi2.png",
      text: "Dapurnya bersih dan nyaman banget, enak dipakai masak bareng temen. Kalau mau nongkrong atau ngemil santai, tinggal pindah ke taman ruang bersama. Rasanya bener-bener kayak di rumah sendiri.",
      bgColor: "bg-[#4B3D37]",
    },
    {
      id: 3,
      name: "Rafa",
      subtitle: "Freelancer",
      avatar: "/teraZ/testi3.png",
      text: "WiFi-nya kencang dan stabil banget, kerja remote nggak terhambat. Suasananya tenang dan nyaman, bikin fokus kerja lebih maksimal.",
      bgColor: "bg-[#955236]",
    },
  ];

  return (
    <section
      id="testimonial"
      className="bg-gradient-to-b from-[#E5E0D8] via-[#C2C0AF] to-[#A5A58D] py-20 px-4 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-16 h-16 bg-[#7A2B1E] rotate-12 rounded-lg flex items-center justify-center shadow-lg mb-6">
            <Star className="w-12 h-12 text-[#E0DCD2] fill-[#E0DCD2]" />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#7A2B1E] text-center">
            Reviews from Our Roomies
          </h2>
        </div>

        {/* MOBILE & TABLET GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-10">
          {reviews.map((item) => (
            <div key={item.id} className={`${item.bgColor} rounded-full p-10 relative shadow-xl`}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="pt-14 text-center">
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-white/80 text-sm mb-3">{item.subtitle}</p>

                <p className="text-white text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP ORGANIC VERSION */}
        <div className="relative hidden lg:block min-h-[750px]">
          {/* ITEM 1 */}
          <div
            className="absolute left-0 top-0 w-[340px]"
            style={{ transform: "rotate(-6deg)" }}
          >
            <TestimonialCard item={reviews[0]} rotate="6deg" />
          </div>

          {/* ITEM 2 */}
          <div
            className="absolute right-10 top-16 w-[360px]"
            style={{ transform: "rotate(4deg)" }}
          >
            <TestimonialCard item={reviews[1]} rotate="-4deg" />
          </div>

          {/* ITEM 3 */}
          <div
            className="absolute left-[30%] bottom-16 w-[360px]"
            style={{ transform: "rotate(-2deg)" }}
          >
            <TestimonialCard item={reviews[2]} rotate="2deg" />
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({ item, rotate }) => {
  return (
    <div className={`${item.bgColor} rounded-full aspect-square p-10 shadow-2xl relative`}>
      <div className="absolute -top-6 left-4 w-24 h-24">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="pt-16 px-3" style={{ transform: `rotate(${rotate})` }}>
        <h3 className="text-lg font-bold text-white">{item.name}</h3>
        <p className="text-white/80 text-sm mb-3">{item.subtitle}</p>
        <p className="text-white text-xs leading-relaxed text-justify">
          {item.text}
        </p>
      </div>
    </div>
  );
};

export default TestimonialsSection;
