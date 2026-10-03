import type { FC } from 'react';
import { Phone, Mail, MessageCircle, Shield, MapPin, Clock } from 'lucide-react';
import type { CompanySettings } from '../types';

interface FooterProps {
  settings: CompanySettings;
  onOpenAdmin: () => void;
}

export const Footer: FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const rawPhone = settings.whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '2' + rawPhone : rawPhone;

  return (
    <footer id="contact" className="bg-[#13331c] text-white pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-3 text-white">تواصل مع نوفا جرين</h2>
        <p className="text-sm text-emerald-200/80 mb-10 max-w-md mx-auto">
          نسعد دائماً بالتواصل معكم وتقديم الاستشارات الفنية والرد على كافة طلباتكم واستفساراتكم
        </p>

        {/* 4 Contact Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('السلام عليكم ، أود طلب منتجات من شركة نوفا جرين')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-emerald-300 font-medium">واتساب للطلب السريع</span>
              <span className="text-sm font-bold text-white">{settings.whatsapp}</span>
            </div>
          </a>

          {/* Phone */}
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#22A3E2]/20 flex items-center justify-center text-[#22A3E2] shrink-0 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-emerald-300 font-medium">اتصال هاتفي</span>
              <span className="text-sm font-bold text-white">{settings.phone}</span>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#1877F2]/20 hover:bg-[#1877F2]/30 border border-[#1877F2]/30 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-blue-200 font-medium">صفحتنا على فيسبوك</span>
              <span className="text-sm font-bold text-white">Nova Green</span>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${settings.email}`}
            className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="block text-[11px] text-emerald-300 font-medium">البريد الإلكتروني</span>
              <span className="text-sm font-bold text-white">{settings.email}</span>
            </div>
          </a>
        </div>

        {/* Address & Working Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {settings.address && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-right">
              <div className="w-9 h-9 rounded-xl bg-[#88C025]/20 flex items-center justify-center text-[#88C025] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-emerald-300 font-medium">العنوان والتغطية</span>
                <span className="text-xs font-semibold text-white/90">{settings.address}</span>
              </div>
            </div>
          )}
          {settings.workingHours && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-right">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-emerald-300 font-medium">ساعات العمل</span>
                <span className="text-xs font-semibold text-white/90">{settings.workingHours}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <span>جميع الحقوق محفوظة © {new Date().getFullYear()} شركة نوفا جرين (Nova Green)</span>
          <div className="flex items-center gap-4">
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-white transition-colors"
            >
              فيسبوك
            </a>
            <span className="text-white/20">•</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#88C025]" />
              <span>لوحة التحكم (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
