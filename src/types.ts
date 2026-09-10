export interface FlowerPackage {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  label: string;
  description: string;
  items: string[];
  icon: string;
  popular?: boolean;
  tag?: string;
  accentColor: string;
}

export interface OrderFormData {
  senderName?: string;
  recipientName: string;
  isSecret?: boolean;
  senderPhone?: string;
  packageName: string;
  message: string;
  notes: string;
}

export interface SubmittedOrder {
  id: string;
  createdAt: string;
  senderName?: string;
  recipientName: string;
  isSecret?: boolean;
  senderPhone?: string;
  packageName: string;
  price: number;
  formattedPrice: string;
  message: string;
  notes?: string;
  paymentProofUrl?: string;
  paymentProofFileName?: string;
  status: 'menunggu_verifikasi' | 'diproses' | 'selesai';
}
