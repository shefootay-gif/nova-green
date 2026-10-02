import type { FC } from 'react';
import { Sprout, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Services: FC = () => {
  const services = [
    {
      title: 'مستلزمات وتغذية زراعية',
      description: 'مجموعة متكاملة من الأسمدة المركبة، العناصر الصغرى المخلبية، والمخصبات الحيوية لتنشيط الجذور وتحفيز النمو الخضري والثمري.',
      icon: Sprout,
      color: 'text-[#88C025]',
      bg: 'bg-[#f2f9e8]',
      borderColor: 'border-[#88C025]/30',
      tag: 'تغذية ومخصبات',
      features: ['عناصر صغرى مخلبية', 'هيوميك وفولفيك نقي', 'كالسيوم وبورون سريع النفاذ'],
    },
    {
      title: 'حلول حماية المحاصيل',
      description: 'أقوى المبيدات المتخصصة لمكافحة الآفات الحشرية، الأكاروسات، الفطريات، وأعفان الجذور وفق برامج المكافحة المتكاملة والمعتمدة.',
      icon: ShieldCheck,
      color: 'text-[#22A3E2]',
      bg: 'bg-[#eaf6fc]',
      borderColor: 'border-[#22A3E2]/30',
      tag: 'وقاية ومكافحة',
      features: ['مبيدات جهازية واسعة المدى', 'مكافحة حاسمة للنيماتودا', 'علاج متخصص لأعفان الجذور'],
    },
    {
      title: 'دعم فني واستشارات للمزارع',
      description: 'مهندسون استشاريون لمتابعة محصولك خطوة بخطوة، وتقديم برامج تسميد ومكافحة دقيقة تناسب طبيعة التربة والطقس واحتياج النبات.',
      icon: HeartHandshake,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      borderColor: 'border-amber-200',
      tag: 'إرشاد زراعي',
      features: ['تحديد الجرعات والمواعيد بدقة', 'تشخيص فوري للآفات بالواتساب', 'متابعة دورية للمحصول'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black text-[#22A3E2] bg-[#eaf6fc] px-4 py-1.5 rounded-full border border-[#22A3E2]/30 mb-3 inline-block">
            خدمات وحلول Nova Green
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            ماذا نقدم <span className="text-[#88C025]">لقطاع الزراعة؟</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
            حلول متكاملة تغطي كافة مراحل نمو النبات، من إعداد التربة والشتل وحتى الحصاد بأعلى جودة تسويقية.
          </p>
        </div>

        {/* 3 Modern Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#fcfdfc] rounded-3xl p-7 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#88C025]/50 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar with Icon and Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center border ${item.borderColor} shadow-2xs group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${item.color}`} />
                    </div>
                    <span className="text-[11px] font-black text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-[#88C025] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs font-bold text-gray-700">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#88C025] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
