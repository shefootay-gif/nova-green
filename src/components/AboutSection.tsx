import { useState } from 'react';
import { Target, Award, ChevronDown } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="about" className="py-16 bg-[#f9fbf8]">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Brand Tag */}
        <span className="text-xs font-bold text-[#88C025] uppercase tracking-wider block mb-2">
          Nova Green
        </span>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          شريكك في الزراعة الحديثة
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto mb-6">
          نهدف إلى بناء علامة زراعية موثوقة تجمع بين جودة المنتج، الخدمة السريعة، والدعم الفني مع التركيز على احتياجات السوق والمزارعين.
        </p>

        {/* Learn More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#88C025] hover:bg-[#77ab1f] text-white text-sm font-bold shadow-sm transition-all mb-10 cursor-pointer"
        >
          <span>{showMore ? 'عرض أقل' : 'اعرف المزيد'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>

        {/* Extended information if expanded */}
        {showMore && (
          <div className="mb-10 text-right bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              تأسست <strong>نوفا جرين (Nova Green)</strong> لتكون صرحاً متكاملاً يدعم الإنتاج الزراعي المستدام من خلال انتقاء أحدث المركبات الزراعية والمخصبات ذات الفاعلية المؤكدة حقلياً.
            </p>
            <p>
              نحن نعمل يداً بيد مع كبرى معامل التطوير الزراعي والمهندسين الاستشاريين لتقديم حلول علاجية ووقائية تضمن للمزارع أعلى إنتاجية وأفضل تصنيف تسويقي للمحاصيل التصديرية والمحلية.
            </p>
          </div>
        )}

        {/* Vision & Values Card Matching the Video */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-right space-y-8 max-w-2xl mx-auto">
          {/* Vision */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f2f9e8] flex items-center justify-center text-[#88C025]">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">رؤيتنا</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-medium pr-10">
              أن تصبح نوفا جرين من العلامات المميزة في مجال المستلزمات والحلول الزراعية من خلال منتجات موثوقة وخدمة احترافية.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Values */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eaf6fc] flex items-center justify-center text-[#22A3E2]">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">قيمنا</h3>
            </div>
            <div className="pr-10">
              <p className="text-base font-bold text-[#13331c]">
                الجودة • المصداقية • الابتكار • خدمة المزارع
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
