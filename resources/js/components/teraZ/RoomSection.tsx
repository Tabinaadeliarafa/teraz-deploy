import React, { useState } from "react";

const RoomSection: React.FC = () => {
  const rooms = [
    {
      id: 1,
      name: "Kamar Tipe A",
      type: "Single Room",
      price: "Rp. 850.000",
      priceNote: "per bulan",
      size: "3 x 4 Meter",
      images: ["/teraZ/kamar2.jpg", "/teraZ/kamar2-2.jpg"],
      facilities: ["Kipas Angin", "Wi-Fi", "Kamar Mandi Luar", "Lemari", "Kasur"],
    },
    {
      id: 2,
      name: "Kamar Tipe B",
      type: "Single Room",
      price: "Rp. 1.000.000",
      priceNote: "per bulan",
      size: "3 x 4 Meter",
      images: ["/teraZ/kamar1.jpg", "/teraZ/kamar1-2.jpg"],
      facilities: ["AC", "Wi-Fi", "Kamar Mandi Dalam", "Lemari", "Kasur"],
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number;
  }>({
    1: 0,
    2: 0,
  });

  const nextImage = (roomId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % totalImages,
    }));
  };

  const prevImage = (roomId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] - 1 + totalImages) % totalImages,
    }));
  };

  const goToImage = (roomId: number, index: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: index,
    }));
  };

  return (
    <section id="room" className="bg-[#E5E0D8] py-14 sm:py-16 px-4 scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        {/* TITLE */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-[#3b0b01] via-[#ca381a] to-[#f8a08f] bg-clip-text text-transparent">
          Room Types for Your Stay
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-[#CEC2BB] rounded-2xl overflow-hidden shadow-lg"
            >
              {/* IMAGE SLIDER */}
              <div className="relative group">
                <img
                  src={room.images[currentImageIndex[room.id]]}
                  alt={`${room.name} - ${currentImageIndex[room.id] + 1}`}
                  className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* NAV BUTTONS */}
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        prevImage(room.id, room.images.length)
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 
                      bg-black/50 hover:bg-black/70 text-white 
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                      flex items-center justify-center transition-all 
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      ‹
                    </button>

                    <button
                      onClick={() =>
                        nextImage(room.id, room.images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 
                      bg-black/50 hover:bg-black/70 text-white 
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                      flex items-center justify-center transition-all 
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      ›
                    </button>

                    {/* DOTS */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {room.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(room.id, index)}
                          className={`h-2 rounded-full transition-all ${
                            currentImageIndex[room.id] === index
                              ? "bg-white w-5"
                              : "bg-white/50 w-2 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* INFO OVERLAY */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <div className="flex justify-between items-end gap-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1">
                        {room.name}
                      </h3>
                      <p className="text-xs sm:text-sm opacity-90">
                        {room.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-bold">
                        {room.price}
                      </p>
                      <p className="text-xs sm:text-sm opacity-90">
                        {room.priceNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-4 sm:p-6">
                <p className="text-[#412E27] mb-2 font-medium text-sm sm:text-base">
                  Ukuran: {room.size}
                </p>

                <p className="text-[#412E27] mb-2 font-medium text-sm sm:text-base">
                  Fasilitas:
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {room.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#49493A] text-white 
                      text-[10px] sm:text-sm rounded-md"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomSection;
