import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  MessageCircle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  Clock,
  RefreshCw
} from 'lucide-react';
import { FLOWER_PACKAGES, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL, MESSAGE_TEMPLATES } from '../data/packages';
import { SubmittedOrder } from '../types';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { QrisPoster } from './QrisPoster';

interface OrderSectionProps {
  selectedPackage: string;
  onPackageChange: (pkgName: string) => void;
}

const packagePrices: Record<string, number> = {
  'Bloom': 8000,
  'Sweet Bloom': 15000,
  'Lovely Bloom': 18000,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

function countWords(text: string): number {
  const cleanText = text.trim();
  if (!cleanText) return 0;
  return cleanText.split(/\s+/).length;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  selectedPackage,
  onPackageChange,
}) => {
  // Form State
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [senderPhone, setSenderPhone] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');

  // Step state: 1 = Form, 2 = Payment (QRIS), 3 = Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Payment State
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Success Order State
  const [lastOrder, setLastOrder] = useState<SubmittedOrder | null>(null);
  const [pastOrders, setPastOrders] = useState<SubmittedOrder[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load past orders from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('flowerfess_orders');
      if (saved) {
        setPastOrders(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage error
    }
  }, []);

  // Compute word count
  const wordCount = countWords(message);

  // Selected package details
  const activePackage = FLOWER_PACKAGES.find(
    (p) => p.name.toLowerCase() === selectedPackage.toLowerCase()
  );
  const currentPrice = packagePrices[selectedPackage] || activePackage?.price || 0;

  // Handle message typing with strict 100 words restriction
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];

    if (words.length > 100) {
      const limitedWords = words.slice(0, 100);
      text = limitedWords.join(' ');
    }

    setMessage(text);
  };

  // Handle Form Submit -> Go to Payment Step (Langkah 1)
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sender = senderName.trim();
    if (!sender) {
      alert('Silakan isi nama dan kelas pengirim terlebih dahulu (Contoh: Alvin XI.3) 🌷');
      return;
    }

    const recipient = recipientName.trim();
    if (!recipient) {
      alert('Silakan isi nama dan kelas penerima terlebih dahulu (Contoh: Alvin XI.3) 🌷');
      return;
    }

    if (!selectedPackage) {
      alert('Silakan pilih paket bunga terlebih dahulu 💐');
      return;
    }

    const msg = message.trim();
    if (!msg) {
      alert('Silakan tulis ucapan untuk penerima 💌');
      return;
    }

    const totalWords = countWords(msg);
    if (totalWords > 100) {
      alert('Ucapan maksimal 100 kata ya 🌷');
      return;
    }

    const price = packagePrices[selectedPackage];
    if (!price) {
      alert('Harga paket tidak ditemukan.');
      return;
    }

    setCurrentStep(2);

    setTimeout(() => {
      const paymentHeader = document.getElementById('paymentStep');
      if (paymentHeader) {
        paymentHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Handle Proof of payment file selection & validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Bukti pembayaran harus berupa gambar.');
      e.target.value = '';
      setPaymentProofFile(null);
      setPaymentProofPreview(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Ukuran bukti pembayaran maksimal 5 MB.');
      e.target.value = '';
      setPaymentProofFile(null);
      setPaymentProofPreview(null);
      return;
    }

    setPaymentProofFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentProofPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copy total amount to clipboard
  const handleCopyAmount = () => {
    if (!currentPrice) return;
    navigator.clipboard.writeText(currentPrice.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Langkah 2: Upload Bukti + Simpan Order ke Supabase
  const handleFinalSubmit = async () => {
    if (!recipientName.trim() || !selectedPackage || !message.trim()) {
      alert('Detail pesanan belum ditemukan. Silakan isi form terlebih dahulu.');
      return;
    }

    if (!supabase) {
      alert('Supabase gagal dimuat. Silakan refresh halaman lalu coba lagi.');
      return;
    }

    if (!paymentProofFile) {
      alert('Silakan upload bukti pembayaran terlebih dahulu 💳');
      if (fileInputRef.current) {
        fileInputRef.current.focus();
      }
      return;
    }

    const file = paymentProofFile;
    if (!file.type.startsWith('image/')) {
      alert('Bukti pembayaran harus berupa gambar.');
      paymentProofFile && handleRemoveFile();
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Ukuran bukti pembayaran maksimal 5 MB.');
      paymentProofFile && handleRemoveFile();
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Unique file name
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
      const filePath = `orders/${uniqueName}`;

      // 2. Upload to Supabase Storage Bucket ('bukti-transfer')
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Storage error:', uploadError);
        throw new Error('Bukti pembayaran gagal diupload.');
      }

      // 3. Insert into Supabase 'orders' table
      const price = packagePrices[selectedPackage] || currentPrice;
      const secretLabel = isSecret ? 'Dirahasiakan (Anonim)' : 'Ditampilkan ke penerima';
      const senderInfoTag = `[Pengirim: ${senderName.trim()} | Status: ${secretLabel}]`;
      const combinedNotes = notes.trim() ? `${senderInfoTag} ${notes.trim()}` : senderInfoTag;

      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          nama_pengirim: senderName.trim(),
          dirahasiakan: isSecret,
          nama_penerima: recipientName.trim(),
          paket: selectedPackage,
          ucapan: message.trim(),
          catatan: combinedNotes,
          harga: price,
          bukti_transfer: filePath,
        });

      if (insertError) {
        console.error('Database error:', insertError);
        throw new Error('Data pesanan gagal disimpan.');
      }

      // 4. Success State
      const orderCode = `FLW-${Math.floor(10000 + Math.random() * 90000)}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newOrder: SubmittedOrder = {
        id: orderCode,
        createdAt: dateStr,
        senderName: senderName.trim(),
        recipientName: recipientName.trim(),
        isSecret: isSecret,
        senderPhone: senderPhone.trim() || '-',
        packageName: selectedPackage,
        price: price,
        formattedPrice: formatPrice(price),
        message: message.trim(),
        notes: notes.trim() || '-',
        paymentProofFileName: file.name,
        paymentProofUrl: paymentProofPreview || undefined,
        status: 'menunggu_verifikasi',
      };

      setLastOrder(newOrder);
      const updatedList = [newOrder, ...pastOrders];
      setPastOrders(updatedList);
      try {
        localStorage.setItem('flowerfess_orders', JSON.stringify(updatedList.slice(0, 10)));
      } catch {
        // LocalStorage fallback
      }

      setIsSubmitting(false);
      setCurrentStep(3);

      setTimeout(() => {
        const resultEl = document.getElementById('orderResult');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

    } catch (error: any) {
      console.error('Order error:', error);
      alert(error?.message || 'Terjadi kesalahan saat mengirim pesanan.');
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleResetForm = () => {
    setSenderName('');
    setRecipientName('');
    setIsSecret(false);
    setSenderPhone('');
    setMessage('');
    setNotes('');
    setPaymentProofFile(null);
    setPaymentProofPreview(null);
    setUploadError(null);
    setCurrentStep(1);
  };

  // WhatsApp confirmation text generator
  const getWhatsAppConfirmationUrl = (order: SubmittedOrder) => {
    const senderDisplay = order.isSecret
      ? `${order.senderName || 'Anonim'} (Dirahasiakan dari penerima 🤫)`
      : `${order.senderName || 'Anonim'} (Ditampilkan pada kartu 💌)`;

    const text = `Halo Admin Flowerfess! 🌷\nSaya sudah melakukan pemesanan via website:\n\n` +
      `🧾 *ID Pesanan:* ${order.id}\n` +
      `👤 *Pengirim:* ${senderDisplay}\n` +
      `🎁 *Penerima:* ${order.recipientName}\n` +
      `💐 *Paket:* ${order.packageName} (${order.formattedPrice})\n` +
      `💌 *Ucapan:* "${order.message}"\n` +
      `📝 *Catatan:* ${order.notes || '-'}\n\n` +
      `Bukti pembayaran QRIS sudah saya simpan/upload ke sistem. Mohon konfirmasi dan proses pesanan saya ya kak. Terima kasih! 🙏✨`;
    return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="order" className="py-16 md:py-24 bg-gradient-to-b from-[#FFFDFD] to-rose-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ================= LEFT INFO COLUMN ================= */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">
              MAKE SOMEONE HAPPY
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug mb-4">
              Send a little<br />happiness. 🌷
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
              Isi detail pesanan dengan lengkap. Setelah itu lanjutkan ke pembayaran
              menggunakan QRIS Flowerfess.
            </p>

            {/* Note Box */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3.5 mb-8">
              <span className="text-xl flex-shrink-0">💡</span>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                Pastikan nama pengirim & penerima sudah disertai kelas dalam satu kolom (Contoh: <strong>Alvin XI.3</strong>) sebelum melanjutkan ke pembayaran.
              </p>
            </div>

            {/* WhatsApp Alternative */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs flex flex-col mb-6">
              <div className="flex items-center gap-2.5 text-emerald-800 font-serif font-bold text-base mb-1">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Tidak ingin pesan melalui website?</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                Kamu bisa langsung menghubungi Flowerfess melalui WhatsApp resmi kami.
              </p>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="whatsapp-order-link"
                className="whatsapp-button inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-colors active:scale-98"
              >
                <span>💬 Pesan via WhatsApp</span>
              </a>
            </div>

            {/* Past Orders Toggle Button */}
            {pastOrders.length > 0 && (
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between text-xs font-bold text-stone-700 hover:text-rose-600 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    Riwayat Pesanan Anda ({pastOrders.length})
                  </span>
                  <span>{showHistory ? '▲ Sembunyikan' : '▼ Lihat'}</span>
                </button>

                {showHistory && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                    {pastOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-2.5 rounded-lg border border-stone-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-stone-800">{ord.id}</span>
                          <span className="text-stone-500 block text-[11px]">
                            {ord.recipientName} • {ord.packageName}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">
                          {ord.status === 'menunggu_verifikasi' ? 'Verifikasi' : ord.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= RIGHT FORM / PAYMENT / SUCCESS ================= */}
          <div className="lg:col-span-7">
            <div className="order-form-wrapper bg-white rounded-3xl p-6 sm:p-9 border border-rose-100 shadow-xl shadow-rose-100/40">
              
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep >= 1 ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-xs font-bold ${currentStep === 1 ? 'text-rose-900' : 'text-stone-400'}`}>
                    Detail Pesanan
                  </span>
                </div>

                <div className="w-8 h-[2px] bg-stone-200" />

                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep >= 2 ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-xs font-bold ${currentStep === 2 ? 'text-rose-900' : 'text-stone-400'}`}>
                    Pembayaran
                  </span>
                </div>

                <div className="w-8 h-[2px] bg-stone-200" />

                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 3 ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-xs font-bold ${currentStep === 3 ? 'text-emerald-700' : 'text-stone-400'}`}>
                    Selesai
                  </span>
                </div>
              </div>

              {/* STEP 1: FORM */}
              {currentStep === 1 && (
                <form id="orderForm" onSubmit={handleProceedToPayment} className="space-y-6">
                  
                  {/* 1. NAMA PENGIRIM */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="senderName" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Nama Pengirim & Kelas <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-medium text-stone-500">
                        Sertakan kelas
                      </span>
                    </div>
                    <input
                      type="text"
                      id="senderName"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Contoh: Alvin XI.3"
                      autoComplete="off"
                      required
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all font-medium text-stone-800"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Sertakan nama dan kelas dalam satu kolom (Contoh: <strong className="text-stone-600 font-semibold">Alvin XI.3</strong>)
                    </p>
                  </div>

                  {/* 2. NAMA PENERIMA */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="recipientName" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Nama Penerima & Kelas <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] font-medium text-stone-500">
                        Sertakan kelas
                      </span>
                    </div>
                    <input
                      type="text"
                      id="recipientName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Contoh: Alvin XI.3"
                      autoComplete="off"
                      required
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all font-medium text-stone-800"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Sertakan nama dan kelas tujuan penerima (Contoh: <strong className="text-stone-600 font-semibold">Alvin XI.3</strong>)
                    </p>
                  </div>

                  {/* 3. OPSI DIRAHASIAKAN ATAU TIDAK */}
                  <div className="form-group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Opsi Kerahasiaan Pengirim <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        id="optionDirahasiakan"
                        className={`relative flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSecret
                            ? 'bg-rose-50/90 border-rose-400 text-rose-950 shadow-xs ring-1 ring-rose-300'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/80'
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacyOption"
                          id="radioDirahasiakan"
                          checked={isSecret}
                          onChange={() => setIsSecret(true)}
                          className="w-4 h-4 text-rose-600 border-stone-300 focus:ring-rose-500 cursor-pointer accent-rose-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">Dirahasiakan</span>
                            <span className="text-xs">🤫</span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                            Nama disembunyikan dari penerima (Kirim sebagai Anonim)
                          </p>
                        </div>
                      </label>

                      <label
                        id="optionTidakDirahasiakan"
                        className={`relative flex items-center gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          !isSecret
                            ? 'bg-rose-50/90 border-rose-400 text-rose-950 shadow-xs ring-1 ring-rose-300'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/80'
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacyOption"
                          id="radioTidakDirahasiakan"
                          checked={!isSecret}
                          onChange={() => setIsSecret(false)}
                          className="w-4 h-4 text-rose-600 border-stone-300 focus:ring-rose-500 cursor-pointer accent-rose-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">Tidak Dirahasiakan</span>
                            <span className="text-xs">💌</span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                            Nama dicantumkan pada kartu ucapan bunga
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* PAKET BUNGA */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="package" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Pilih paket bunga <span className="text-rose-500">*</span>
                      </label>
                      {currentPrice > 0 && (
                        <span className="text-xs font-bold text-rose-600">
                          {formatPrice(currentPrice)}
                        </span>
                      )}
                    </div>

                    {/* Standard Select matching HTML requirement */}
                    <select
                      id="package"
                      value={selectedPackage}
                      onChange={(e) => onPackageChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all font-medium text-stone-800"
                    >
                      <option value="">— Pilih paket bunga —</option>
                      <option value="Bloom">Bloom — Rp 8.000</option>
                      <option value="Sweet Bloom">Sweet Bloom — Rp 15.000</option>
                      <option value="Lovely Bloom">Lovely Bloom — Rp 18.000</option>
                    </select>

                    {/* Quick Package Selector Cards */}
                    <div className="grid grid-cols-3 gap-2.5 mt-3">
                      {FLOWER_PACKAGES.map((pkg) => {
                        const isSelected = selectedPackage.toLowerCase() === pkg.name.toLowerCase();
                        return (
                          <button
                            type="button"
                            key={pkg.id}
                            onClick={() => onPackageChange(pkg.name)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-200'
                                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                            }`}
                          >
                            <span className="text-lg block mb-0.5">{pkg.icon}</span>
                            <span className="text-xs font-bold text-stone-900 block truncate">
                              {pkg.name}
                            </span>
                            <span className="text-[11px] text-stone-500 block">
                              {pkg.formattedPrice}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* UCAPAN DENGAN WORD COUNTER (MAKS 100 KATA) */}
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Ucapan <span className="text-rose-500">*</span>
                      </label>
                      <div className="character-count flex items-center gap-1.5">
                        {wordCount >= 100 && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                            Maksimal tercapai
                          </span>
                        )}
                        <span
                          id="messageCount"
                          className={`text-xs font-mono font-semibold ${
                            wordCount >= 100 ? 'text-rose-600 font-bold' : wordCount >= 85 ? 'text-amber-600' : 'text-stone-500'
                          }`}
                        >
                          {wordCount}/100 kata
                        </span>
                      </div>
                    </div>

                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={handleMessageChange}
                      placeholder="Tulis ucapan manis untuk penerima (maksimal 100 kata)..."
                      required
                      className={`w-full px-4 py-3 text-sm rounded-xl bg-stone-50 border transition-all resize-y leading-relaxed ${
                        wordCount >= 100
                          ? 'border-rose-400 bg-rose-50/20 focus:ring-2 focus:ring-rose-400/40 focus:border-rose-500'
                          : 'border-stone-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400'
                      }`}
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      *Maksimal 100 kata agar muat rapi di kartu ucapan bunga.
                    </p>

                    {/* Quick suggestion templates */}
                    <div className="mt-2.5">
                      <p className="text-[11px] text-stone-400 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-rose-400" />
                        Inspirasi ucapan cepat (klik untuk gunakan):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {MESSAGE_TEMPLATES.map((tmpl, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setMessage(tmpl)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-stone-200/80 rounded-lg text-[11px] text-stone-600 transition-colors cursor-pointer text-left"
                          >
                            Template #{idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CATATAN TAMBAHAN */}
                  <div className="form-group">
                    <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Catatan tambahan{' '}
                      <span className="optional text-stone-400 font-normal lowercase">
                        (opsional)
                      </span>
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: warna bunga atau catatan lainnya"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all"
                    />
                  </div>

                  {/* SUBMIT BUTTON TO PAYMENT */}
                  <button
                    type="submit"
                    id="orderSubmitButton"
                    className="order-button w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm tracking-wide shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lanjut ke Pembayaran 💌</span>
                  </button>
                </form>
              )}

              {/* STEP 2: PAYMENT (QRIS) */}
              {currentStep === 2 && (
                <div id="paymentStep" className="payment-step space-y-6">
                  
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Ubah detail pesanan</span>
                  </button>

                  <div className="payment-header flex items-center gap-3">
                    <div className="payment-number w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-serif font-bold text-base flex items-center justify-center">
                      02
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Pembayaran
                      </h3>
                      <p className="text-xs text-stone-500">
                        Scan QRIS lalu upload bukti pembayaran.
                      </p>
                    </div>
                  </div>

                  {/* ORDER SUMMARY */}
                  <div className="order-summary bg-stone-50 rounded-2xl p-4.5 border border-stone-200/80 space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/60">
                      <span className="text-stone-500">Pengirim & Kelas</span>
                      <div className="text-right">
                        <strong className="text-stone-900 font-semibold block">{senderName}</strong>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isSecret
                            ? 'bg-amber-100/80 text-amber-800 border border-amber-200/70'
                            : 'bg-rose-100/80 text-rose-800 border border-rose-200/70'
                        }`}>
                          {isSecret ? 'Dirahasiakan 🤫' : 'Ditampilkan 💌'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/60">
                      <span className="text-stone-500">Penerima & Kelas</span>
                      <strong className="text-stone-900 font-semibold">{recipientName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200/60">
                      <span className="text-stone-500">Paket</span>
                      <strong id="summaryPackage" className="text-stone-900 font-semibold">
                        {selectedPackage}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600 font-medium text-xs">Total</span>
                      <div className="flex items-center gap-2">
                        <strong id="summaryPrice" className="text-rose-600 font-bold text-base sm:text-lg">
                          {formatPrice(currentPrice)}
                        </strong>
                        <button
                          type="button"
                          onClick={handleCopyAmount}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Salin nominal angka"
                        >
                          {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* REALISTIC OFFICIAL QRIS CARD (RAMASATRIA STORE) */}
                  <QrisPoster amount={currentPrice} />

                  {/* PROOF UPLOAD */}
                  <div className="proof-upload space-y-2">
                    <label htmlFor="paymentProof" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Bukti pembayaran <span className="text-rose-500">*</span>
                    </label>
                    <p className="text-xs text-stone-500">
                      Upload screenshot/foto bukti transfer. Maksimal 5 MB.
                    </p>

                    {!paymentProofPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-200 hover:border-rose-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-rose-50/30"
                      >
                        <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-stone-700">
                          Klik untuk memilih file bukti transfer
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Mendukung format gambar (JPG, PNG, WEBP)
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={paymentProofPreview}
                            alt="Bukti Transfer Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                          />
                          <div className="text-left">
                            <p className="text-xs font-bold text-stone-800 truncate max-w-[180px] sm:max-w-xs">
                              {paymentProofFile?.name || 'bukti-pembayaran.jpg'}
                            </p>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Siap dikirim ke Supabase
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 font-semibold cursor-pointer"
                        >
                          Ganti
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      id="paymentProof"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {uploadError}
                      </p>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="button"
                    id="paymentSubmitButton"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="payment-button w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm tracking-wide shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Mengirim... ⏳</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Pesanan</span>
                        <span className="text-base">↗</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* STEP 3: SUCCESS RESULT */}
              {currentStep === 3 && lastOrder && (
                <div id="orderResult" className="order-result text-center py-4 space-y-6">
                  
                  {/* Success checkmark badge */}
                  <div className="success-icon w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
                      Pesanan berhasil! 🌷
                    </h3>
                    <p className="text-sm text-stone-600">
                      Data pesanan dan bukti pembayaran sudah berhasil dikirim.
                    </p>
                  </div>

                  {/* Order Ticket Card */}
                  <div className="bg-stone-50 border border-rose-100 rounded-2xl p-5 text-left space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
                      <span className="text-xs text-stone-500">ID Pesanan:</span>
                      <strong className="font-mono text-sm font-bold text-rose-700">
                        {lastOrder.id}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="text-stone-500">Pengirim & Kelas:</span>
                      <div className="text-right flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">{lastOrder.senderName || 'Anonim'}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full ${
                          lastOrder.isSecret
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {lastOrder.isSecret ? 'Dirahasiakan 🤫' : 'Ditampilkan 💌'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="text-stone-500">Penerima & Kelas:</span>
                      <span className="font-bold text-stone-900">{lastOrder.recipientName}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="text-stone-500">Paket:</span>
                      <span className="font-bold text-stone-900">{lastOrder.packageName}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="text-stone-500">Total Harga:</span>
                      <span className="font-bold text-rose-600">{lastOrder.formattedPrice}</span>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80">
                      <span className="text-[11px] text-stone-400 block mb-1">Ucapan:</span>
                      <p className="text-xs italic text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200 leading-relaxed">
                        "{lastOrder.message}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                      <span>Status:</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Tersimpan di Database
                      </span>
                    </div>
                  </div>

                  {/* WHATSAPP CONFIRMATION CTA */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={getWhatsAppConfirmationUrl(lastOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-200 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Konfirmasi ke WhatsApp Admin</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full py-2.5 text-xs font-semibold text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      + Pesan Lagi
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

