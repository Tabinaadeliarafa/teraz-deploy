import React from 'react';
import { usePage, Link } from '@inertiajs/react';

const colors = {
  text: '#FFFFFF',
  buttonLogin: '#C9A982',
  buttonContact: '#FFFFFF',
  buttonContactText: '#2C2420',
  buttonContactBorder: '#8B7355',
};

const Navbar = () => {
  const { auth } = usePage<{ auth?: { user?: { name: string } } }>().props;
  const user = auth?.user;

  return (
    <nav
      className="w-full px-4 sm:px-6 md:px-8 flex items-center h-[70px] sm:h-[80px] md:h-[85px]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full min-w-0">

        {/* LOGO */}
        <div className="relative flex items-center flex-shrink-0">
          <img
            src="/teraZ/logo.png"
            alt="Arzeta Logo"
            className="
              object-contain 
              w-20 h-20 
              sm:w-14 sm:h-14 
              md:w-16 md:h-16 
              lg:w-20 lg:h-20
            "
          />
        </div>

        {/* MENU */}
        <div
          className="
            hidden sm:flex 
            items-center 
            gap-4 sm:gap-6 md:gap-8 
            mx-2 md:mx-4 
            flex-shrink min-w-0 
            overflow-x-auto no-scrollbar
          "
          style={{ whiteSpace: 'nowrap' }}
        >
          {['Home', 'About', 'Facilities', 'Room', 'Testimonial'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                font-medium
                text-xs sm:text-sm md:text-base
                tracking-wide
                transition-colors duration-200
              "
              style={{ color: colors.text }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.buttonLogin)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.text)}
            >
              {item}
            </a>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* LOGIN / USER */}
          {!user ? (
            <Link href="/login">
              <button
                className="
                  rounded-full 
                  font-medium 
                  text-xs sm:text-sm md:text-base
                  transition-all hover:scale-105
                  px-3 sm:px-4 md:px-5
                  h-8 sm:h-9 md:h-10
                "
                style={{
                  backgroundColor: colors.buttonLogin,
                  color: colors.buttonContactText,
                }}
              >
                Login
              </button>
            </Link>
          ) : (
            <Link href="/user">
              <button
                className="
                  rounded-full
                  font-medium
                  text-xs sm:text-sm md:text-base
                  transition-all hover:scale-105
                  px-3 sm:px-4 md:px-5
                  h-8 sm:h-9 md:h-10
                "
                style={{
                  backgroundColor: colors.buttonLogin,
                  color: colors.buttonContactText,
                }}
              >
                {user.name}
              </button>
            </Link>
          )}

          {/* CONTACT */}
          <a
            href="#contact"
            className="
              rounded-full 
              font-medium 
              text-xs sm:text-sm md:text-base
              transition-all hover:scale-105 
              flex items-center justify-center
              px-3 sm:px-4 md:px-5
              h-8 sm:h-9 md:h-10
            "
            style={{
              backgroundColor: colors.buttonContact,
              color: colors.buttonContactText,
              border: `2px solid ${colors.buttonContactBorder}`,
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
