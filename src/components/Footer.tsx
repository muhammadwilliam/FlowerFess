import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { CONTACT_WHATSAPP_URL } from '../data/packages';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand */}
          <div className="flex flex-col">
            <a href="#home" className="flex items-center gap-2 text-white text-2xl font-serif font-bold tracking-tight">
              <span>🌷</span>
              <span>Flowerfess</span>
            </a>
            <p className="text-stone-400 text-sm mt-1">
              Give flowers. Deliver feelings.
            </p>
            <p className="text-stone-500 text-xs mt-2 max-w-sm">
              Membantu kamu menyampaikan kasih sayang, apresiasi, dan ucapan hangat melalui bunga cantik.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-medium">
            <a href="#home" className="text-stone-300 hover:text-rose-400 transition-colors">
              Home
            </a>
            <a href="#services" className="text-stone-300 hover:text-rose-400 transition-colors">
              Services
            </a>
            <a href="#flowers" className="text-stone-300 hover:text-rose-400 transition-colors">
              Flowers
            </a>
            <a href="#how-it-works" className="text-stone-300 hover:text-rose-400 transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-stone-300 hover:text-rose-400 transition-colors">
              About
            </a>
            <a href="#order" className="text-stone-300 hover:text-rose-400 transition-colors">
              Order
            </a>
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 text-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Admin</span>
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Flowerfess. Made with love 🌷</p>
          <p className="flex items-center gap-1">
            <span>Crafted for meaningful moments</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>

      </div>
    </footer>
  );
};
