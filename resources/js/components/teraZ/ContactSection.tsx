import { MapPin, Mail, MessageCircle } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-[#A5A58D] to-[#868664] 
      flex items-center justify-center px-4 py-16 sm:py-20 scroll-mt-28"
    >
      <div className="max-w-7xl w-full">

        {/* TITLE */}
        <div className="text-center mb-12 sm:mb-16 relative">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black 
            text-[#412E27] inline-block tracking-wide"
            style={{ textShadow: "2px 2px 2px rgba(232, 220, 200, 0.6)" }}
          >
            Get in Touch!
          </h2>
        </div>

        {/* CONTACT CARDS */}
        <div
          className="
          flex flex-col lg:flex-row 
          gap-6 sm:gap-8 md:gap-10 lg:gap-14 
          items-center justify-center"
        >

          {/* ============ ALAMAT ============ */}
          <a
            href="https://maps.google.com/?q=Jl.+Medokan+Asri+Barat+VII+No.2,+Rungkut,+Surabaya"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full max-w-[280px] sm:max-w-sm transition-transform duration-300 hover:scale-105"
          >
            <div className="absolute -top-4 -left-4 bg-[#F1E0CB] rounded-full p-2.5 shadow-lg z-10">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#412E27]" strokeWidth={2.5} />
            </div>

            <div className="bg-[#5D5145] rounded-2xl p-4 sm:p-6 pt-10 shadow-xl min-h-[190px] flex flex-col">
              <h3 className="text-base sm:text-lg font-medium text-[#F1E0CB] mb-2">
                Alamat
              </h3>

              <p className="text-[#F1E0CB] font-semibold text-xs sm:text-sm mb-3 leading-relaxed">
                Jl. Medokan Asri Barat VII No.2, Kec. Rungkut, Surabaya, Jawa Timur
              </p>

              <p className="text-[#C8B8A5] text-[11px] sm:text-xs leading-relaxed mt-auto">
                Klik untuk membuka lokasi di Google Maps
              </p>
            </div>
          </a>

          {/* ============ WHATSAPP ============ */}
          <a
            href="https://wa.me/6285866750741"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full max-w-[280px] sm:max-w-sm transition-transform duration-300 hover:scale-105"
          >
            <div className="absolute -top-4 -left-4 bg-[#F1E0CB] rounded-full p-2.5 shadow-lg z-10">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#412E27]" strokeWidth={2.5} />
            </div>

            <div className="bg-[#5D5145] rounded-2xl p-4 sm:p-6 pt-10 shadow-xl min-h-[190px] flex flex-col">
              <h3 className="text-base sm:text-lg font-medium text-[#F1E0CB] mb-2">
                WhatsApp
              </h3>

              <p className="text-[#F1E0CB] font-semibold text-sm sm:text-base mb-1">
                +62 858-6675-0741
              </p>

              <p className="text-[#F1E0CB] text-xs mb-3">(Ibu Seta)</p>

              <p className="text-[#C8B8A5] text-[11px] sm:text-xs leading-relaxed mt-auto">
                Klik untuk langsung chat via WhatsApp
              </p>
            </div>
          </a>

          {/* ============ EMAIL ============ */}
          <a
            href="mailto:arzetacolivin@gmail.com"
            className="relative w-full max-w-[280px] sm:max-w-sm transition-transform duration-300 hover:scale-105"
          >
            <div className="absolute -top-4 -left-4 bg-[#F1E0CB] rounded-full p-2.5 shadow-lg z-10">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#412E27]" strokeWidth={2.5} />
            </div>

            <div className="bg-[#5D5145] rounded-2xl p-4 sm:p-6 pt-10 shadow-xl min-h-[190px] flex flex-col">
              <h3 className="text-base sm:text-lg font-medium text-[#F1E0CB] mb-2">
                Email
              </h3>

              <p className="text-[#F1E0CB] font-semibold text-xs sm:text-sm mb-3 break-all">
                arzetacolivin@gmail.com
              </p>

              <p className="text-[#C8B8A5] text-[11px] sm:text-xs leading-relaxed mt-auto">
                Klik untuk mengirim email langsung kepada kami
              </p>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
