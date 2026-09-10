import React from 'react';
import { Check, Star, Sparkles } from 'lucide-react';
import { FLOWER_PACKAGES } from '../data/packages';

interface FlowersSectionProps {
  onSelectPackage: (packageName: string) => void;
  selectedPackageName?: string;
}

export const FlowersSection: React.FC<FlowersSectionProps> = ({
  onSelectPackage,
  selectedPackageName,
}) => {
  return (
    <section id="flowers" className="py-16 md:py-24 bg-[#FFFDFD]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
            FLOWER COLLECTION
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
            Choose your flowers.
          </h2>
          <span className="block mt-3 text-stone-600 text-sm sm:text-base">
            Pilih paket bunga favoritmu dan tambahkan ucapan untuk orang spesial.
          </span>
        </div>

        {/* 3 Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {FLOWER_PACKAGES.map((pkg) => {
            const isPopular = pkg.popular;
            const isCurrent = selectedPackageName === pkg.name;

            return (
              <div
                key={pkg.id}
                id={`package-${pkg.id}`}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-white border-2 border-rose-400 shadow-xl shadow-rose-100/60 ring-4 ring-rose-50 md:-translate-y-2'
                    : 'bg-white border border-stone-200/90 shadow-xs hover:border-rose-200 hover:shadow-md'
                }`}
              >
                {/* Popular Tag */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-rose-600 to-pink-600 text-[11px] font-bold uppercase tracking-wider text-white rounded-full shadow-sm flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-white" />
                    <span>{pkg.tag || 'FAVORITE'}</span>
                  </div>
                )}

                <div className="p-7 sm:p-8 flex-1 flex flex-col">
                  {/* Top Graphic */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-50 to-pink-50 border border-rose-100 flex items-center justify-center text-3xl mb-5 shadow-inner">
                    {pkg.icon}
                  </div>

                  {/* Label & Title */}
                  <p className="text-[11px] font-bold uppercase tracking-widest text-rose-600 mb-1">
                    {pkg.label}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Inclusion items */}
                  <div className="mt-auto border-t border-rose-50 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                      Isi Paket:
                    </p>
                    <ul className="space-y-2.5">
                      {pkg.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                          <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Bottom Footer with Price & Choose Button */}
                <div className="p-6 sm:p-7 pt-0 border-t border-stone-100 bg-stone-50/40 rounded-b-2xl mt-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[11px] text-stone-500 uppercase tracking-wide">
                        Harga
                      </span>
                      <strong className="text-xl sm:text-2xl font-bold text-stone-900">
                        {pkg.formattedPrice}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectPackage(pkg.name)}
                      id={`choose-package-${pkg.id}`}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                        isPopular || isCurrent
                          ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow-md'
                          : 'bg-white text-stone-800 border border-stone-300 hover:border-rose-400 hover:text-rose-600'
                      }`}
                    >
                      <span>{isCurrent ? 'Dipilih' : 'Pilih'}</span>
                      {isCurrent ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
