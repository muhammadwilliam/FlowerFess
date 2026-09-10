import React from 'react';
import { SERVICES } from '../data/packages';

interface ServicesSectionProps {
  onSelectServiceOrder: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceOrder }) => {
  return (
    <section id="services" className="py-16 md:py-24 bg-white border-y border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
            OUR SERVICES
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
            What can Flowerfess<br />do for you?
          </h2>
          <span className="block mt-3 text-stone-600 text-sm sm:text-base">
            Pilih layanan yang sesuai dengan kejutan yang ingin kamu berikan.
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => {
            const isFeatured = service.featured;
            return (
              <div
                key={service.title}
                id={`service-card-${index + 1}`}
                className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isFeatured
                    ? 'bg-gradient-to-b from-rose-50/90 to-pink-50/50 border-2 border-rose-300 shadow-md ring-4 ring-rose-100/50'
                    : 'bg-[#FFFDFD] border border-stone-200/80 hover:border-rose-200 hover:shadow-sm'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-rose-600 text-[10px] font-extrabold uppercase tracking-wider text-white rounded-full shadow-xs">
                    {service.badge}
                  </div>
                )}

                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${
                      isFeatured ? 'bg-white shadow-xs' : 'bg-rose-50'
                    }`}
                  >
                    {service.icon}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-100/60">
                  <button
                    type="button"
                    onClick={onSelectServiceOrder}
                    className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isFeatured
                        ? 'text-rose-700 hover:text-rose-800'
                        : 'text-stone-500 hover:text-rose-600'
                    }`}
                  >
                    <span>Pesan layanan ini</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
