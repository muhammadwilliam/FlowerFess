import React from 'react';
import { Heart, Sparkles, Flower2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-t border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Visual Column */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-gradient-to-tr from-rose-100/80 via-pink-50 to-amber-50 border border-rose-200/60 shadow-lg flex flex-col items-center justify-center p-6 text-center">
              
              <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center text-5xl mb-4 border border-rose-100">
                🌷
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 rounded-full border border-rose-100 shadow-2xs text-[11px] font-semibold text-rose-700">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Handcrafted with Care</span>
              </div>

              <span className="text-xs text-stone-500 mt-2">
                Fresh Flowers & Sweet Treats
              </span>

              {/* Decorative Corner Badge */}
              <div className="absolute -bottom-3 -right-3 bg-rose-600 text-white p-2.5 rounded-2xl shadow-sm text-xs font-bold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>100% Sincere</span>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="md:col-span-7 flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
              ABOUT FLOWERFESS
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug mb-5">
              Small flowers.<br />
              <span className="italic font-normal text-rose-600">Big feelings.</span>
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p>
                Flowerfess adalah jasa yang membantu kamu memberikan bunga sekaligus
                menyampaikan ucapan kepada seseorang yang spesial.
              </p>
              <p>
                Kami percaya bahwa hadiah tidak harus besar untuk menjadi berarti. Sebuah bunga kecil
                dengan ucapan yang tulus bisa membuat hari seseorang menjadi jauh lebih bahagia.
              </p>
            </div>

            {/* Quote Box */}
            <div className="mt-7 p-5 rounded-2xl bg-rose-50/50 border-l-4 border-rose-500 italic text-sm text-stone-700 font-serif">
              “A flower is a simple way to say what words sometimes cannot.”
            </div>

            {/* Feature list */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Bunga Peacock Aster Segar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Kartu Ucapan Berkualitas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Pengemasan Rapi & Aman</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Bisa Kirim Anonim</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
