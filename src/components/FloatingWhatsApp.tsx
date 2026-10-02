import type { FC } from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export const FloatingWhatsApp: FC<FloatingWhatsAppProps> = ({
  phoneNumber = '011 31603110',
}) => {
  const raw = phoneNumber.replace(/[^0-9]/g, '');
  const cleanPhone = raw.startsWith('0') ? '2' + raw : raw;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'السلام عليكم، أود التواصل مع شركة نوفا جرين والطلب من المنتجات الزراعية'
  )}`;

  return (
    <aside aria-label="طلب عبر واتساب" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-white/80"
        title="اضغط للطلب عبر واتساب 01131603110"
      >
        <span className="text-xs sm:text-sm font-black hidden sm:inline">اضغط للطلب</span>
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
      </a>
    </aside>
  );
};
