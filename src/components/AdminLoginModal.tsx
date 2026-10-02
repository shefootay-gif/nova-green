import { useState, type FC, type FormEvent } from 'react';
import { Lock, X, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await StorageService.login(password);
      if (user) {
        setPassword('');
        onLoginSuccess();
      } else {
        setError('كلمة المرور غير صحيحة (الافتراضية: admin123)');
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة ثانية');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#f2f9e8] text-[#88C025] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#88C025]/30">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">دخول لوحة التحكم</h2>
          <p className="text-xs text-gray-500 mt-1">
            منطقة مخصصة لمشرف الموقع لإضافة وتعديل المنتجات
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              كلمة مرور المشرف
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="أدخل كلمة المرور..."
                autoFocus
                className="w-full bg-[#f9fbf8] border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#88C025] transition-all text-right"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              كلمة المرور الافتراضية للتجربة: <code className="text-[#88C025] font-bold">admin123</code> (يمكن تغييرها من الداخل)
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#13331c] hover:bg-[#1a4426] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
