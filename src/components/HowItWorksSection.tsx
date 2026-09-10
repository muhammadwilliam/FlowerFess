import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/packages';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-rose-50/40 via-white to-rose-50/20 border-t border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
            HOW IT WORKS
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
            Sending flowers is easy.
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            Hanya 4 langkah mudah untuk mengirimkan senyuman dan kehangatan ke orang tercinta.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.step}
              id={`how-step-${idx + 1}`}
              className="relative bg-white rounded-2xl p-6 border border-rose-100/90 shadow-xs hover:shadow-sm hover:border-rose-200 transition-all flex flex-col"
            >
              {/* Step Number */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-50 to-pink-100 text-rose-700 font-serif font-bold text-xl flex items-center justify-center mb-5 border border-rose-200/60">
                {step.step}
              </div>

              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                {step.title}
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed">
                {step.desc}
              </p>

              {/* Subtle connecting indicator for desktop */}
              {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-rose-200 text-rose-400 text-xs flex items-center justify-center font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
