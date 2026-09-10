import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (import.meta as any)?.env?.VITE_SUPABASE_URL || 'https://guegexasypvuaoavkcgt.supabase.co';

export const SUPABASE_KEY =
  (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_g3ZMZCSz6LVc4lt0IfQdKg_FVlPcofM';

export const STORAGE_BUCKET = 'bukti-transfer';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

export interface OrderInsertPayload {
  nama_pengirim?: string;
  dirahasiakan?: boolean;
  nama_penerima: string;
  paket: string;
  ucapan: string;
  catatan?: string;
  harga: number;
  bukti_transfer: string;
}

/**
 * Upload transfer proof to Supabase Storage in STORAGE_BUCKET ('bukti-transfer')
 */
export async function uploadPaymentProof(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
  const filePath = `orders/${uniqueName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error('Storage error:', uploadError);
    throw new Error(uploadError.message || 'Bukti pembayaran gagal diupload.');
  }

  return filePath;
}

/**
 * Insert order into the 'orders' table in Supabase
 */
export async function insertOrderRecord(payload: OrderInsertPayload) {
  const insertData: Record<string, any> = {
    nama_pengirim: payload.nama_pengirim || '',
    dirahasiakan: typeof payload.dirahasiakan === 'boolean' ? payload.dirahasiakan : false,
    nama_penerima: payload.nama_penerima,
    paket: payload.paket,
    ucapan: payload.ucapan,
    catatan: payload.catatan || '',
    harga: payload.harga,
    bukti_transfer: payload.bukti_transfer,
  };

  const { error: insertError } = await supabase
    .from('orders')
    .insert(insertData);

  if (insertError) {
    console.error('Database error:', insertError);
    throw new Error(insertError.message || 'Data pesanan gagal disimpan.');
  }

  return { success: true };
}

console.log('🌷 Flowerfess + Supabase loaded successfully!');
console.log('Supabase client initialized:', !!supabase);
