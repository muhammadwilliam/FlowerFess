import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink, Smartphone, ScanLine, ShieldCheck, ZoomIn, X } from 'lucide-react';

interface QrisPosterProps {
  amount?: number;
  showAmountBadge?: boolean;
}

export const QrisPoster: React.FC<QrisPosterProps> = ({ amount, showAmountBadge = true }) => {
  const [copiedNmid, setCopiedNmid] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const nmid = 'ID1026587085956';
  const merchantName = 'RamaSatria Store';
  const terminal = 'A01';
  const acquirerCode = '93600915';
  const printVersion = '1.0.08.09.26';

  const handleCopyNmid = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nmid);
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handleDownloadQr = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = '/assets/qris-code.png';
    link.download = `QRIS-${merchantName.replace(/\s+/g, '_')}-${terminal}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* MAIN QRIS POSTER CARD */}
      <div className="relative bg-white border border-stone-300 rounded-2xl shadow-lg overflow-hidden transition-all">
        {/* Top-Left Red Geometric Accent (Official QRIS Styling) */}
        <div 
          className="absolute top-0 left-0 w-16 h-16 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, #c4122d 0%, #c4122d 50%, transparent 50%)',
          }}
        />

        {/* Bottom-Right Red Accent */}
        <div 
          className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(315deg, #c4122d 0%, #c4122d 50%, transparent 50%)',
          }}
        />

        <div className="p-4 sm:p-5 relative z-0">
          {/* HEADER: QRIS LOGO & GPN LOGO */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            {/* QRIS Logo */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#c4122d] font-sans leading-none">
                    QRIS
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold text-stone-600 uppercase tracking-tight leading-tight">
                  QR Code Standar Pembayaran Nasional
                </span>
              </div>
            </div>

            {/* GPN Logo */}
            <div className="flex items-center gap-1.5 pl-2">
              <div className="flex flex-col items-center">
                {/* Red Garuda / GPN Wing Emblem */}
                <svg className="w-8 h-6 text-[#c4122d]" viewBox="0 0 40 30" fill="currentColor">
                  <path d="M20 3 C12 3 5 10 2 18 C7 15 13 14 20 14 C27 14 33 15 38 18 C35 10 28 3 20 3 Z" />
                  <path d="M20 16 C14 16 8 19 4 24 C9 22 14 21 20 21 C26 21 31 22 36 24 C32 19 26 16 20 16 Z" />
                  <circle cx="20" cy="8" r="3" fill="#c4122d" />
                </svg>
                <span className="text-[10px] font-black tracking-widest text-[#c4122d] font-sans leading-none">
                  GPN
                </span>
              </div>
            </div>
          </div>

          {/* MERCHANT IDENTIFIER */}
          <div className="text-center mt-3.5 mb-2">
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-wide leading-tight">
              {merchantName}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                NMID: {nmid}
              </span>
              <span className="text-xs font-mono font-bold text-stone-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {terminal}
              </span>
            </div>

            {showAmountBadge && amount && amount > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-900">
                <span>Nominal Transfer:</span>
                <span className="text-rose-600 font-extrabold">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)}
                </span>
              </div>
            )}
          </div>

          {/* QR CODE CONTAINER */}
          <div 
            className="my-3 p-3 sm:p-4 bg-white border border-stone-300 rounded-xl shadow-inner relative flex flex-col items-center justify-center group cursor-pointer hover:border-rose-400 transition-all"
            onClick={() => setIsZoomed(true)}
            title="Klik untuk memperbesar QR"
          >
            <div className="relative">
              <img
                src="/assets/qris-code.png"
                alt={`QRIS ${merchantName} ${nmid}`}
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto"
                loading="eager"
              />
              
              {/* Subtle hover zoom overlay hint */}
              <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center pointer-events-none">
                <span className="px-2.5 py-1 bg-white/90 text-stone-800 text-[11px] font-semibold rounded-full shadow-sm flex items-center gap-1">
                  <ZoomIn className="w-3 h-3 text-rose-500" /> Klik untuk Perbesar
                </span>
              </div>
            </div>

            {/* SATU QRIS UNTUK SEMUA */}
            <div className="w-full text-center mt-2.5 pt-2 border-t border-stone-100">
              <p className="text-[11px] sm:text-xs font-black tracking-wide text-stone-900 uppercase">
                SATU QRIS UNTUK SEMUA
              </p>
              <p className="text-[9px] text-stone-500 mt-0.5">
                Cek aplikasi penyelenggara di: <span className="underline text-stone-600">www.aspi-qris.id</span>
              </p>
            </div>
          </div>

          {/* FOOTER INFO: PRINT & HOW TO PAY */}
          <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-stone-600">
            {/* Left Column: Cetak info */}
            <div className="space-y-0.5 text-left">
              <p className="font-mono text-[9px] text-stone-500">
                Dicetak oleh: <strong className="text-stone-800">{acquirerCode}</strong> (DANA)
              </p>
              <p className="font-mono text-[9px] text-stone-400">
                Versi cetak: {printVersion}
              </p>
            </div>

            {/* Right Column: Cara bayar steps */}
            <div className="space-y-0.5 text-left sm:text-right">
              <p className="font-bold text-stone-800 text-[9px] uppercase tracking-wider">
                Cara bayar:
              </p>
              <div className="flex items-center sm:justify-end gap-2 text-[8px] text-stone-600">
                <span className="inline-flex items-center gap-0.5">
                  <Smartphone className="w-2.5 h-2.5 text-rose-500" /> Buka App
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5">
                  <ScanLine className="w-2.5 h-2.5 text-rose-500" /> Scan QR
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Bayar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <button
          type="button"
          onClick={handleDownloadQr}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-rose-500" />
          <span>Unduh QRIS (Galeri)</span>
        </button>

        <button
          type="button"
          onClick={handleCopyNmid}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          {copiedNmid ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>Salin NMID</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
          <span>Perbesar</span>
        </button>
      </div>

      <p className="text-center text-[11px] text-stone-500 mt-2">
        Mendukung semua bank & e-wallet (BCA, Mandiri, BRI, BNI, DANA, GoPay, OVO, ShopeePay, LinkAja)
      </p>

      {/* ZOOMED MODAL */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pt-2 mb-3">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
                QRIS Pembayaran
              </span>
              <h4 className="text-lg font-extrabold text-stone-900 mt-0.5">
                {merchantName}
              </h4>
              <p className="text-xs font-mono text-stone-500">
                NMID: {nmid} • {terminal}
              </p>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl my-2">
              <img
                src="/assets/qris-code.png"
                alt={`QRIS ${merchantName}`}
                className="w-72 h-72 object-contain mx-auto"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Simpan ke Galeri
              </button>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
