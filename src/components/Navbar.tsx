import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { CONTACT_WHATSAPP_URL } from '../data/packages';

interface NavbarProps {
  onOrderClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Flowers', href: '#flowers' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDFD]/90 backdrop-blur-md shadow-xs border-b border-rose-100/60 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          id="nav-logo"
          className="group flex items-center gap-2 text-stone-900 transition-transform active:scale-95"
        >
          <span className="text-2xl transition-transform group-hover:scale-110">🌷</span>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-rose-950">
              Flowerfess
            </span>
            <span className="text-[10px] uppercase tracking-widest text-rose-500 font-semibold -mt-1 hidden sm:inline-block">
              Deliver Feelings
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={CONTACT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-whatsapp-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-full transition-all"
            title="Chat WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onOrderClick}
            id="nav-order-btn"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOrderClick}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-full cursor-pointer"
          >
            Order
          </button>
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          id="mobile-dropdown-menu"
          className="md:hidden bg-[#FFFDFD] border-b border-rose-100 px-5 pt-3 pb-6 shadow-lg animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-medium text-stone-700 hover:text-rose-600 border-b border-rose-50/80 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOrderClick();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
              >
                Order Now 💐
              </button>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-center text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
