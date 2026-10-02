import type { FC } from 'react';
import { Sprout, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Services: FC = () => {
  const services = [
    {
      title: 'مستلزمات زراعية',
      description: 'مجموعة من الأسمدة والمغذيات والمخصبات والمستلزمات الزراعية.',
      icon: Sprout,
      color: 'text-[#88C025]',
      bg: 'bg-[#f2f9e8]',
      borderColor: 'border-[#88C025]/20',
    },
    {
      title: 'حلول حماية المحاصيل',
      description: 'منتجات وحلول لمشكلات الآفات والأمراض وفق التوصيات الزراعية المعتمدة.',
      icon: ShieldCheck,
      color: 'text-[#22A3E2]',
      bg: 'bg-[#eaf6fc]',
      borderColor: 'border-[#22A3E2]/20',
    },
    {
      title: 'دعم فني للمزارع',
      description: 'معلومات وإرشادات تساعدك على اختيار البرنامج المناسب للمحصول.',
      icon: HeartHandshake,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      borderColor: 'border-amber-200/50',
    },
  ];

  return (
    <section id="services" className="py-16 bg-[#f9fbf8]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">ماذا نقدم؟</h2>
          <p className="text-base text-gray-500 font-medium">
            حلول عملية تناسب احتياجات المزارع والسوق الزراعي
          </p>
        </div>

        {/* 3 Cards Matching Video */}
        <div className="space-y-4 sm:space-y-5">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100/90 shadow-sm hover:shadow-md transition-all flex items-start gap-5 hover:border-gray-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 border ${item.borderColor}`}>
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
