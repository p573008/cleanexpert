import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Dog, 
  Wind, 
  Box,
  Calendar as CalendarIcon,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { auth, signInWithGoogle } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createBooking } from '../services/bookingService';
import { ensureUserProfile } from '../services/userService';

interface BookingFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function BookingPage({ onComplete, onCancel }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    address: '',
    contact: '',
    date: null as Date | null,
    time: '',
    hasPets: false,
    options: [] as string[],
    totalPrice: 145000 // Sample base price
  });

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, you might want to save guest bookings too,
      // but here we'll just pass the data to App.tsx which will handle
      // saving to Firebase if the user is authenticated.
      onComplete(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: '서비스 종류' },
    { id: 2, title: '상세 정보' },
    { id: 3, title: '날짜 및 시간' },
    { id: 4, title: '최종 확인' }
  ];

  // Calendar dates
  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1));
  const timeSlots = ['09:00', '11:00', '14:00', '16:00'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Progress Bar */}
      <div className="mb-16">
        <div className="flex justify-between mb-6">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3">
              <div 
                className={cn(
                  "w-12 h-12 rounded-sm flex items-center justify-center font-black transition-all",
                  step >= s.id ? "bg-brand-secondary text-white shadow-xl shadow-blue-500/30 rotate-45" : "bg-slate-100 text-slate-300"
                )}
              >
                <span className={cn(step >= s.id ? "-rotate-45" : "")}>{s.id}</span>
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest mt-2", step >= s.id ? "text-brand-primary" : "text-slate-300")}>{s.title}</span>
            </div>
          ))}
        </div>
        <div className="h-[2px] bg-slate-100 rounded-full relative">
          <motion.div 
            className="absolute h-full bg-brand-secondary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white p-12 shadow-2xl border-active border-t-8 border-brand-secondary"
          >
            <h2 className="text-4xl font-extrabold mb-10 text-brand-primary tracking-tighter">어떤 공간을 청소할까요?</h2>
            <div className="grid gap-6">
              {[
                { id: 'studio', name: '원룸/오피스텔', desc: '싱글족을 위한 컴팩트 케어' },
                { id: 'apartment-small', name: '아파트 (20평대)', desc: '화목한 가정을 위한 표준 케어' },
                { id: 'apartment-large', name: '아파트 (30평대 이상)', desc: '넓은 공간을 위한 프리미엄 케어' },
                { id: 'house', name: '기타/상가', desc: '별도 상담이 필요한 특수 공간' }
              ].map((type) => (
                <button 
                  key={type.id}
                  onClick={() => { setFormData({ ...formData, serviceType: type.name }); nextStep(); }}
                  className={cn(
                    "flex items-center justify-between p-8 border-2 transition-all group text-left",
                    formData.serviceType === type.name ? "border-brand-secondary bg-blue-50/50" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div>
                    <p className="text-xl font-black text-brand-primary uppercase tracking-tight">{type.name}</p>
                    <p className="text-slate-400 font-medium text-sm mt-1">{type.desc}</p>
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                    formData.serviceType === type.name ? "bg-brand-secondary border-brand-secondary" : "border-slate-200 group-hover:border-brand-secondary"
                  )}>
                    {formData.serviceType === type.name && <CheckCircle2 className="text-white" size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 shadow-2xl border-t-8 border-brand-secondary"
          >
            <h2 className="text-4xl font-extrabold mb-10 text-brand-primary tracking-tighter">세부 정보를 알려주세요.</h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">방문 주소</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-5 focus-within:border-brand-secondary transition-all">
                  <MapPin className="text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="도로명 주소를 입력해주세요"
                    className="flex-grow bg-transparent outline-none font-bold text-brand-primary"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">연락처</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-5 focus-within:border-brand-secondary transition-all">
                  <Phone className="text-slate-400" size={20} />
                  <input 
                    type="tel" 
                    placeholder="010-0000-0000"
                    className="flex-grow bg-transparent outline-none font-bold text-brand-primary"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">추가 옵션</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'pets', name: '반려동물 있음', icon: <Dog size={18} /> },
                    { id: 'balcony', name: '창틀/베란다 추가', icon: <Wind size={18} /> },
                    { id: 'fridge', name: '냉장고 내부 청소', icon: <Box size={18} /> }
                  ].map((opt) => (
                    <button 
                      key={opt.id}
                      onClick={() => {
                        const newOpts = formData.options.includes(opt.name) 
                          ? formData.options.filter(o => o !== opt.name)
                          : [...formData.options, opt.name];
                        setFormData({...formData, options: newOpts});
                      }}
                      className={cn(
                        "flex items-center gap-4 p-5 border-2 transition-all text-sm font-bold uppercase tracking-tight",
                        formData.options.includes(opt.name) ? "border-brand-secondary bg-blue-50 text-brand-secondary" : "border-slate-50 text-slate-500 bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      {opt.icon} {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-16 flex gap-6">
              <button onClick={prevStep} className="px-10 py-5 bg-slate-100 text-slate-400 font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all">이전</button>
              <button 
                onClick={nextStep} 
                disabled={!formData.address || !formData.contact}
                className="flex-grow py-5 bg-brand-primary text-white font-black text-xs tracking-widest uppercase disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10"
              >
                다음 02 / 04
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-12 shadow-2xl border-t-8 border-brand-secondary"
          >
            <h2 className="text-4xl font-extrabold mb-10 text-brand-primary tracking-tighter">방문 희망 일시</h2>
            
            <div className="space-y-12">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">날짜 선택</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {availableDates.map((date) => (
                    <button 
                      key={date.toISOString()}
                      onClick={() => setFormData({...formData, date})}
                      className={cn(
                        "p-5 rounded-none border-2 transition-all text-center flex flex-col items-center gap-1",
                        formData.date && isSameDay(formData.date, date) ? "bg-brand-secondary text-white border-brand-secondary font-black shadow-lg shadow-blue-500/20" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <span className="text-[10px] opacity-60 uppercase font-black">{format(date, 'eee')}</span>
                      <span className="text-xl tracking-tight">{format(date, 'd')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">시간 선택</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {timeSlots.map((time) => (
                    <button 
                      key={time}
                      onClick={() => setFormData({...formData, time})}
                      className={cn(
                        "py-5 border-2 transition-all font-black text-sm tracking-widest uppercase",
                        formData.time === time ? "border-brand-secondary bg-blue-50 text-brand-secondary" : "border-slate-50 text-slate-400 bg-slate-50 hover:border-slate-100"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 flex gap-6">
              <button onClick={prevStep} className="px-10 py-5 bg-slate-100 text-slate-400 font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all">이전</button>
              <button 
                onClick={nextStep} 
                disabled={!formData.date || !formData.time}
                className="flex-grow py-5 bg-brand-primary text-white font-black text-xs tracking-widest uppercase disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10"
              >
                다음 03 / 04
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-16 shadow-2xl border-t-8 border-brand-secondary text-center"
          >
            <div className="w-20 h-20 bg-blue-50 text-brand-secondary rounded-sm rotate-45 flex items-center justify-center mx-auto mb-10 shadow-lg shadow-blue-500/10">
              <CheckCircle2 size={40} className="-rotate-45" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 text-brand-primary tracking-tighter">최종 예약 확인</h2>
            <p className="text-slate-400 font-bold mb-12 italic uppercase tracking-widest text-xs">Please review your reservation details.</p>

            <div className="bg-slate-50 p-10 text-left space-y-6 mb-12 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none">
                 <p className="text-8xl font-black italic">CONFIRM</p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200 pb-4 relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</span>
                <span className="text-xl font-black text-brand-primary uppercase">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200 pb-4 relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</span>
                <span className="text-xl font-black text-brand-primary">{formData.date && format(formData.date, 'yyyy. MM. dd')} — {formData.time}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200 pb-4 relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</span>
                <span className="text-lg font-black text-brand-primary">{formData.address}</span>
              </div>
              <div className="flex justify-between items-center pt-6 relative z-10">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</p>
                   <p className="text-4xl font-black text-brand-secondary leading-none mt-1">₩{formData.totalPrice.toLocaleString()}</p>
                </div>
                <button 
                  onClick={handleFinalize}
                  disabled={isSubmitting}
                  className="bg-brand-secondary text-white w-20 h-20 flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:translate-x-2 transition-transform disabled:opacity-50"
                >
                   {isSubmitting ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (
                     <ChevronRight size={40} />
                   )}
                </button>
              </div>
            </div>

            <button onClick={prevStep} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-brand-primary transition-colors">데이터 수정하기</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
