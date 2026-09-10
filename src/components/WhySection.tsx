import React from 'react';
import { WHY_POINTS } from '../data/packages';

export const WhySection: React.FC = () => {
  return (
    <section id="why-section" className="py-16 md:py-20 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
            WHY FLOWERFESS?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
            More than just<br />a bouquet.
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Setiap bunga kami rangkai dengan rasa, menjembatani pesan yang ingin kamu sampaikan
            agar sampai langsung ke hati penerima.
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {WHY_POINTS.map((item, index) => (
            <div
              key={item.title}
              id={`why-card-${index + 1}`}
              className="group bg-white rounded-2xl p-7 border border-rose-100/80 shadow-xs hover:shadow-md hover:border-rose-200 transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
