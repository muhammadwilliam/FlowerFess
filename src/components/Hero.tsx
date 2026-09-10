import React from 'react';
import { ArrowRight, Heart, Sparkles, Send, Gift } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
  onExploreFlowersClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onExploreFlowersClick }) => {
  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Soft background ambient floral glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-tr from-rose-100/60 via-pink-50/40 to-amber-50/50 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Pill Label */}
            <div
              id="hero-label-badge"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Flowers • Message • Surprise</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15] mb-5">
              Give flowers.<br />
              <span className="italic font-normal text-rose-600">Deliver feelings.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed mb-8">
              Flowerfess hadir untuk membantu kamu menyampaikan perhatian melalui bunga dan
              ucapan yang dibuat khusus untuk orang spesial.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOrderClick}
                id="hero-primary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-full shadow-md shadow-rose-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Pesan Sekarang</span>
                <span className="text-base">💐</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={onExploreFlowersClick}
                id="hero-secondary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 active:scale-98 border border-stone-200/90 rounded-full shadow-xs hover:border-stone-300 transition-all cursor-pointer"
              >
                <span>Lihat Bunga</span>
              </button>
            </div>

            {/* Micro value badges */}
            <div className="mt-9 pt-7 border-t border-rose-100/70 w-full flex flex-wrap items-center gap-6 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>Mulai dari Rp 8.000</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Kartu Ucapan Personal</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-amber-500" />
                <span>Paket Bunga & Snack</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200/50 via-pink-100/40 to-amber-100/40 animate-pulse" />
              
              {/* Central Flower Bubble */}
              <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-rose-50 to-pink-100/80 border-4 border-white shadow-xl flex flex-col items-center justify-center text-center p-4">
                <span className="text-6xl sm:text-7xl select-none filter drop-shadow-sm transition-transform hover:scale-110 duration-300">
                  💐
                </span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Peacock Aster
                </span>
                <span className="text-[11px] text-stone-500">Fresh & Beautiful</span>
              </div>

              {/* Floating Card 1: Personal Message */}
              <div
                id="hero-floating-card-1"
                className="absolute -top-3 sm:top-2 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-xs border border-rose-100 shadow-md shadow-rose-100/50 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 transition-transform hover:-translate-y-1 duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-sm">
                  💌
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Personal Message</p>
                  <p className="text-[10px] text-stone-500">Tulis ucapan tulusmu</p>
                </div>
              </div>

              {/* Floating Card 2: Made with Love */}
              <div
                id="hero-floating-card-2"
                className="absolute -bottom-3 sm:bottom-3 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-xs border border-rose-100 shadow-md shadow-rose-100/50 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 transition-transform hover:translate-y-1 duration-300"
              >
                <div className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-sm">
                  🌷
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Made with Love</p>
                  <p className="text-[10px] text-stone-500">Rapi & Berkesan</p>
                </div>
              </div>

              {/* Floating Card 3: Easy QRIS */}
              <div
                id="hero-floating-card-3"
                className="absolute bottom-6 -left-3 sm:-left-8 z-20 bg-white/95 backdrop-blur-xs border border-emerald-100 shadow-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 hidden sm:flex"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-stone-700">QRIS Payment Ready</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
