import React from "react";

const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      title: "WiFi Gratis",
      description:
        "WiFi stabil siap nemenin kamu belajar, kerja, atau streaming tanpa buffering.",
    },
    {
      title: "Parkir Aman",
      description:
        "Area parkir luas dengan keamanan untuk semua kendaraan penghuni.",
    },
    {
      title: "Air Bersih",
      description:
        "Air bersih yang selalu tersedia untuk kebutuhan sehari-hari kamu.",
    },
    {
      title: "Ruang Tamu & Santai",
      description:
        "Spot santai nyaman buat sharing dan kumpul bareng teman-teman.",
    },
    {
      title: "Dapur Bersama",
      description:
        "Dapur bersama lengkap dengan peralatan masak harian atau ngemil.",
    },
    {
      title: "Dispenser Air Minum",
      description:
        "Dispenser air minum dengan pilihan air panas dan dingin yang selalu ready.",
    },
    {
      title: "Kulkas Bersama",
      description:
        "Kulkas bersama siap simpan bahan masak atau stok minuman dingin.",
    },
    {
      title: "Mesin Cuci",
      description:
        "Mesin cuci bersama yang bikin urusan laundry jadi lebih simpel dan cepat.",
    },
  ];

  const rules = {
    left: [
      "Menjaga kebersihan kamar dan lingkungan.",
      "Menjaga ketenangan & kenyamanan bersama.",
      "Menjaga komunikasi dengan pengelola dan sesama penghuni.",
      "Menghormati sesama penghuni.",
    ],
    right: [
      "Mengunci kamar, pintu utama, gerbang dengan baik.",
      "Merawat peralatan bersama.",
      "Melaporkan kerusakan fasilitas kepada pengelola.",
      "Mematikan air, lampu, dan kompor setelah digunakan.",
    ],
  };

  return (
    <section
      id="facilities"
      className="bg-gradient-to-b from-[#DDD3CF] to-[#F5F2EE] 
      py-14 sm:py-16 px-4 sm:px-6 lg:px-8 scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto">

        {/* ================= IMAGE GALLERY ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            { src: "/teraZ/ruangsantai.jpg", alt: "Ruang Santai" },
            { src: "/teraZ/dapur.jpg", alt: "Dapur" },
            { src: "/teraZ/ruangtamu.jpg", alt: "Ruang Tamu" },
            { src: "/teraZ/pojokan.jpg", alt: "Pojok Ruangan" },
          ].map((img, i) => (
            <div
              key={i}
              className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg 
              transition-transform duration-300 hover:scale-105"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* ================= TITLE ================= */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#412E27] text-[#F1E0CB] px-3 py-1 shadow-md rounded-md">
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold">
              All the Facilities for Your Comfort
            </h2>
          </div>
        </div>

        {/* ================= FACILITIES GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {facilities.map((facility, index) => (
            <div key={index} className="text-center px-2">
              <h3 className="text-base sm:text-lg font-semibold text-[#412E27] mb-2">
                {facility.title}
              </h3>
              <p className="text-[#412E27] text-xs sm:text-sm leading-relaxed">
                {facility.description}
              </p>
            </div>
          ))}
        </div>

        {/* ================= RULES ================= */}
        <div className="bg-[#DFD2CB] rounded-xl p-5 sm:p-8 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-[#651407] mb-5 text-left">
            Peraturan dan Ketentuan Kos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

            {/* LEFT */}
            <div>
              <ul className="space-y-3">
                {rules.left.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#412E27] text-base mr-2">•</span>
                    <span className="text-[#412E27] text-xs sm:text-base leading-relaxed">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT */}
            <div>
              <ul className="space-y-3">
                {rules.right.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#412E27] text-base mr-2">•</span>
                    <span className="text-[#412E27] text-xs sm:text-base leading-relaxed">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default FacilitiesSection;