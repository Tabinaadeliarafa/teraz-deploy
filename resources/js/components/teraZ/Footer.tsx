export default function Footer() {
  return (
    <footer className="bg-[#49493A] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">

        {/* GRID UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 mb-10">

          {/* ================= DESCRIPTION ================= */}
          <div className="space-y-3 text-left md:text-justify">
            <h3 className="text-lg sm:text-xl font-bold">
              Arzeta <span className="text-[#B3B792]">Co - Living</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#F1E0CB] leading-relaxed max-w-xs">
              Tempat tinggal nyaman dengan fasilitas lengkap dan layanan modern. 
              Bukan cuma kos, tapi rumah kedua untukmu.
            </p>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div className="flex flex-col items-start md:items-center">
            <div className="w-full max-w-[180px]">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Quick Links
              </h3>

              <ul className="space-y-3 text-left">
                {[
                  { label: "Home", href: "#home" },
                  { label: "About", href: "#about" },
                  { label: "Facilities & Room", href: "#facilities" },
                  { label: "Testimonial", href: "#testimonial" },
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-[#F1E0CB] hover:text-white transition-colors text-xs sm:text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= CONTACT US ================= */}
          <div className="flex flex-col items-start md:items-end">
            <div className="w-full max-w-xs">
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                Contact Us
              </h3>

              <ul className="space-y-3 text-xs sm:text-sm text-[#F1E0CB] text-left break-words">

                {/* WhatsApp */}
                <li>
                  <a
                    href="https://wa.me/6285866750741"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp: +62 858-6675-0741
                  </a>
                </li>

                {/* Email */}
                <li>
                  <a
                    href="mailto:arzetacolivin@gmail.com"
                    className="hover:text-white transition-colors break-all"
                  >
                    Email: arzetacolivin@gmail.com
                  </a>
                </li>

                {/* Alamat */}
                <li>
                  <a
                    href="https://maps.google.com/?q=Jl.+Medokan+Asri+Barat+VII+No.2,+Rungkut,+Surabaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors block leading-relaxed"
                  >
                    Alamat: Jl. Medokan Asri Barat VII No.2, 
                    Kec. Rungkut, Surabaya, Jawa Timur
                  </a>
                </li>

              </ul>
            </div>
          </div>

        </div>

        {/* ================= DIVIDER ================= */}
        <div className="border-t border-[#9D9482] pt-4">
          <p className="text-center text-[10px] sm:text-xs text-[#9D9482]">
            © 2025 Arzeta Co - Living. Selalu hadir dengan dedikasi terbaik.
          </p>
        </div>
      </div>
    </footer>
  );
}
