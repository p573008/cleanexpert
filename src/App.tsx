/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Sparkles, 
  Calendar, 
  ThumbsUp, 
  User as UserIcon, 
  ChevronRight, 
  Menu, 
  X,
  Clock,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  LogOut,
  Star,
  Settings,
  CreditCard,
  Bell
} from 'lucide-react';
import { Page } from './types';
import { cn } from './lib/utils';
import BookingPage from './components/BookingPage';
import { auth, signInWithGoogle } from './services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { ensureUserProfile, getUserProfile } from './services/userService';
import { subscribeToUserBookings, subscribeToAllBookings, createBooking } from './services/bookingService';
import { subscribeToReviews } from './services/reviewService';
import { format } from 'date-fns';

// --- Views ---

interface ViewProps {
  onStartBooking?: () => void;
  onComplete?: (data: any) => void;
  onCancel?: () => void;
}

const HomeView = ({ onStartBooking }: ViewProps) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="flex flex-col"
  >
    {/* Hero Section */}
    <section className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-hidden">
      {/* Left Column */}
      <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center gap-10 bg-white">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-black tracking-widest uppercase italic">
            Premium Space Recovery Service
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-tight text-brand-primary tracking-tighter">
            당신의 공간,<br/>
            <span className="text-brand-secondary">다시 태어나다.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-md">
            일상의 품격을 바꾸는 전문가의 손길. 바쁜 당신을 위한 완벽한 휴식, CLEANEXPERT가 깨끗함을 넘어 안심까지 배달합니다.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onStartBooking}
            className="px-10 py-5 bg-brand-secondary text-white font-black text-sm tracking-widest uppercase shadow-2xl shadow-blue-500/30 hover:bg-opacity-90 transition-all"
          >
            지금 시작하기 — 30초
          </button>
          <button 
            onClick={() => {}}
            className="px-10 py-5 border-2 border-slate-200 text-slate-600 font-bold text-sm tracking-widest uppercase hover:border-brand-primary transition-all"
          >
            서비스 보러가기
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100 mt-4">
          {[
            { id: "01", label: "TRUST", title: "100% 신원 검증" },
            { id: "02", label: "DETAIL", title: "보이지 않는 곳까지" },
            { id: "03", label: "ECO", title: "친환경 세제 사용" }
          ].map((f) => (
            <div key={f.id} className="space-y-1">
              <p className="text-[10px] font-black text-brand-secondary italic">{f.id} {f.label}</p>
              <p className="text-sm font-bold text-brand-primary">{f.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column (Visual) */}
      <div className="w-full lg:w-1/2 bg-brand-primary relative flex items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover" 
            alt="Interior"
           />
        </div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/20 rounded-full -mr-48 -mt-48 backdrop-blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-white/10 rounded-full -ml-32 -mb-32"></div>
        
        {/* Decorative Text */}
        <div className="absolute bottom-12 right-12 text-right z-10 hidden sm:block">
          <p className="text-white/10 text-[10rem] font-black leading-none select-none tracking-tighter">
            CLEAN<br/>EXPERT
          </p>
        </div>

        {/* Floating Stat Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-10 shadow-2xl relative z-20 border-t-[12px] border-brand-secondary max-w-sm w-full"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-brand-primary uppercase italic">Quick Check</h3>
            <span className="text-[10px] bg-slate-100 px-3 py-1 text-slate-400 font-bold uppercase tracking-widest">Live Status</span>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">누적 예약 건수</span>
              <span className="text-lg font-black text-brand-secondary">15,420+</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">배정 진행률</span>
              <span className="text-lg font-black text-brand-secondary">98.2%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Footer Info Bar */}
    <div className="hidden lg:flex fixed bottom-0 left-0 w-1/2 p-10 items-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-300 z-40">
      <span>© 2026 CLEANEXPERT INC.</span>
      <span className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-secondary rounded-full"></div> 개인정보 처리방침</span>
      <span className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-secondary rounded-full"></div> 이용약관</span>
    </div>
  </motion.div>
);

const ReviewView = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    return subscribeToReviews(setReviews);
  }, []);

  const defaultReviews = [
    { name: "이*진", date: "2026.04.15", content: "정말 감동입니다. 퇴근하고 왔을 때 새집에 이사온 것 같은 기분이었어요. 사소한 곳까지 신경 써주셔서 감사합니다.", rate: 5, img: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80" },
    { name: "김*우", date: "2026.04.12", content: "이사 청소 불렀는데 정말 만족스럽습니다. 창틀 먼지 하나 없이 깨끗하네요. 다음에도 꼭 이용할 예정입니다.", rate: 5, img: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80" },
    { name: "박*연", date: "2026.04.09", content: "전문가의 손길은 다르네요. 주방 기름때가 말끔하게 사라졌어요. 친환경 세제라 아이들 있는 집에도 안심입니다.", rate: 4, img: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80" },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tighter uppercase italic text-brand-primary">Customer Reviews</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">실제 고객들의 생생한 후기를 확인하세요.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 shadow-xl border border-slate-100 border-t-4 border-brand-secondary">
          <Star className="text-brand-accent" fill="currentColor" />
          <span className="text-3xl font-black">4.9</span>
          <span className="text-slate-400 font-bold text-xs">/ 5.0 ({reviews.length > 0 ? reviews.length : '2,450'}+)</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayReviews.map((review, i) => (
          <div key={review.id || review.name} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all">
            <div className="h-48 overflow-hidden">
              <img src={review.img || "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" alt="Review" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < (review.rate || review.rating) ? "text-brand-accent" : "text-slate-200"} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  {review.createdAt ? format(review.createdAt.toDate(), 'yyyy.MM.dd') : review.date}
                </span>
              </div>
              <p className="text-slate-600 mb-6 line-clamp-3 italic">"{review.content}"</p>
              <p className="font-bold text-sm">{review.userName || review.name} 고객님</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MyPageView = ({ user, setCurrentPage }: { user: User | null, setCurrentPage: (page: Page) => void }) => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      return subscribeToUserBookings(user.uid, setBookings);
    }
  }, [user]);

  if (!user) {
     return (
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-md mx-auto py-20 text-center">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
             <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 rotate-3">
               <Sparkles size={32} />
             </div>
             <h2 className="text-2xl font-black mb-2">반가워요!</h2>
             <p className="text-slate-500 mb-8 font-medium">CLEANEXPERT와 함께 공간의 가치를<br/>회복할 준비가 되셨나요?</p>
             
             <div className="space-y-4">
                <button 
                  onClick={async () => {
                    try {
                      const credential = await signInWithGoogle();
                      await ensureUserProfile(credential.user);
                    } catch (err) {
                      console.error(err);
                    }
                  }} 
                  className="w-full py-4 bg-white text-slate-800 border-2 border-slate-100 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                  Google로 시작하기
                </button>
             </div>
          </div>
       </motion.div>
     );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-7xl mx-auto pb-20">
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <div className="w-20 h-20 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary mb-4 overflow-hidden">
              {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <UserIcon size={40} />}
            </div>
            <h3 className="font-bold text-xl">{user.displayName || '회원님'}</h3>
            <p className="text-xs text-slate-400 break-all">{user.email}</p>
         </div>
         {[
           { icon: <Calendar size={18} />, label: "예약 내역" },
           { icon: <Bell size={18} />, label: "알림 센터" },
           { icon: <CreditCard size={18} />, label: "결제 관리" },
           { icon: <Settings size={18} />, label: "설정" },
         ].map((item, i) => (
           <button key={i} className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all text-slate-600 font-medium">
             {item.icon} {item.label}
           </button>
         ))}
         <button 
           onClick={() => signOut(auth)}
           className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 text-red-500 font-medium transition-all"
         >
           <LogOut size={18} /> 로그아웃
         </button>
      </aside>

      {/* Content */}
      <div className="flex-grow space-y-6">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">현재 진행 중인 예약</h2>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-brand-surface border border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-brand-secondary text-white rounded-2xl flex flex-col items-center justify-center font-bold">
                          <span className="text-xs uppercase">{format(new Date(booking.date), 'MMM')}</span>
                          <span className="text-xl">{format(new Date(booking.date), 'd')}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{booking.serviceType}</h4>
                          <p className="text-slate-500 text-sm">{booking.address}</p>
                          <p className={cn("text-xs font-bold uppercase mt-1", 
                            booking.status === 'pending' ? 'text-amber-500' : 'text-emerald-500'
                          )}>{booking.status}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2 rounded-full border border-slate-200 text-sm font-bold bg-white">상세보기</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-brand-surface rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">예약 내역이 없습니다.</p>
                <button onClick={() => setCurrentPage('booking')} className="text-brand-secondary font-bold text-sm mt-2">지금 예약하러 가기</button>
              </div>
            )}
         </div>

         <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-4">포인트 / 쿠폰</h2>
               <div className="flex justify-between items-end">
                 <p className="text-3xl font-black">5,000 P</p>
                 <button className="text-brand-secondary text-sm font-bold underline">내역 보기</button>
               </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-xl font-bold mb-4">고객 센터</h2>
               <p className="text-slate-500 text-sm mb-4">도움이 필요하신가요? 저희가 도와드릴게요.</p>
               <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold">1:1 문의하기</button>
            </div>
         </div>
      </div>
    </div>
  </motion.div>
  );
};

const AdminDashboard = ({ user, setCurrentPage }: { user: User | null, setCurrentPage: (page: Page) => void }) => {
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      return subscribeToAllBookings(setAllBookings);
    }
  }, [user]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 bg-slate-950 min-h-screen text-white -mt-20 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter uppercase italic">Dashboard</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">관리자 전용 대시보드입니다.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-4 bg-brand-secondary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
                <Settings size={20} /> 시스템 설정
            </button>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 p-4 bg-white/10 hover:bg-white/20 transition-all">
              <LogOut size={24} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "오늘의 작업", value: "12", trend: "+2", icon: <Calendar /> },
            { label: "새로운 요청", value: allBookings.filter(b => b.status === 'pending').length.toString(), trend: "+1", icon: <Clock /> },
            { label: "완료율", value: "98.2%", trend: "+0.5%", icon: <CheckCircle2 /> },
            { label: "총 매출", value: "₩4,250K", trend: "+12%", icon: <ThumbsUp /> }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-8 hover:bg-slate-800 transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-brand-secondary/10 text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all transform rotate-6 group-hover:rotate-0">
                  {stat.icon}
                </div>
                <span className="text-emerald-400 text-[10px] font-black px-2 py-1 bg-emerald-400/10 uppercase">{stat.trend}</span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-10 ring-1 ring-white/5 border-t-[12px] border-brand-secondary">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Schedule</h3>
                <button className="text-brand-secondary font-black text-[10px] uppercase tracking-widest underline">전체 달력 보기</button>
              </div>
              <div className="space-y-4">
                {allBookings.length > 0 ? allBookings.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-800/50 border border-white/5 hover:border-brand-secondary/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-700/50 flex items-center justify-center font-black text-brand-secondary rotate-12">
                        {item.time}
                      </div>
                      <div>
                        <p className="font-black text-lg text-white uppercase">{item.userId.substring(0, 8)}...</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.serviceType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                          "px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]",
                          item.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-500" : 
                          item.status === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-slate-700 text-slate-400"
                      )}>
                        {item.status}
                      </span>
                      <ChevronRight size={16} className="text-slate-600" />
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-center py-10 uppercase font-black text-xs tracking-widest">No bookings found.</p>
                )}
              </div>
          </div>
          <div className="space-y-8">
              <div className="bg-brand-secondary p-10 flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-500/20">
                <div className="w-32 h-32 border-[12px] border-brand-primary/20 border-t-brand-primary flex items-center justify-center mb-6 rotate-45">
                    <span className="text-3xl font-black -rotate-45">85%</span>
                </div>
                <h3 className="text-2xl font-black mb-1 uppercase italic">Efficiency</h3>
                <p className="font-black text-[10px] uppercase tracking-widest opacity-70">주간 목표 달성!</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-8">
                <h3 className="text-lg font-black mb-8 uppercase tracking-widest italic">Activity</h3>
                <div className="space-y-8">
                    {allBookings.slice(0, 3).map((booking, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-[2px] h-10 bg-brand-secondary" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight">신규 예약: {booking.serviceType}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                             {booking.createdAt ? format(booking.createdAt.toDate(), 'p') : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const profile = await getUserProfile(u.uid);
        setIsAdminUser(profile?.role === 'admin');
      } else {
        setIsAdminUser(false);
      }
    });
    return unsubscribe;
  }, []);

  const navigation = [
    { id: 'home', name: '홈', icon: <Home size={20} /> },
    { id: 'services', name: '서비스', icon: <Sparkles size={20} /> },
    { id: 'booking', name: '예약하기', icon: <Calendar size={20} /> },
    { id: 'reviews', name: '후기', icon: <ThumbsUp size={20} /> },
    { id: 'mypage', name: '마이페이지', icon: <UserIcon size={20} /> },
  ];

  const handleBookingComplete = async (data: any) => {
    console.log("Booking Confirmed:", data);
    setBookingSuccess(true);
    
    // If user is logged in, save the booking to Firebase
    if (user) {
      try {
        await createBooking(user.uid, {
          ...data,
          date: data.date instanceof Date ? data.date.toISOString() : data.date,
        });
      } catch (err) {
        console.error("Failed to save booking:", err);
      }
    }

    // After 3 seconds, go to My Page or Home
    setTimeout(() => {
      setBookingSuccess(false);
      setCurrentPage('mypage');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface selection:bg-brand-secondary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-24">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-brand-secondary rounded-sm rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-primary uppercase">CLEAN<span className="text-brand-secondary">EXPERT</span></span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={cn(
                  "text-sm font-semibold uppercase tracking-widest transition-all hover:text-brand-secondary",
                  currentPage === item.id ? "text-brand-secondary border-b-2 border-brand-secondary pb-1" : "text-slate-500"
                )}
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage('booking')}
              className="ml-4 px-6 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-secondary transition-colors shadow-lg"
            >
              예약하기
            </button>
            {isAdminUser && (
              <button 
                onClick={() => setCurrentPage('admin')}
                className="p-2 text-slate-400 hover:text-brand-primary"
              >
                <BarChart3 size={20} />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation Backdrop */}
        <AnimatePresence>
          {isMenuOpen && (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-primary/20 backdrop-blur-sm z-40 md:hidden"
             />
          )}
        </AnimatePresence>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-2xl p-6 flex flex-col gap-8"
            >
              <div className="flex justify-between items-center mb-4">
                 <span className="text-xl font-bold">CLEANEXPERT</span>
                 <button onClick={() => setIsMenuOpen(false)}><X /></button>
              </div>
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl font-bold text-lg",
                      currentPage === item.id ? "bg-brand-secondary/10 text-brand-secondary" : "hover:bg-slate-50 text-slate-600"
                    )}
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
                {isAdminUser && (
                  <button 
                    onClick={() => { setCurrentPage('admin'); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 rounded-xl font-bold bg-slate-900 text-white mt-4"
                  >
                    <BarChart3 size={20} /> 관리자 대시보드
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomeView onStartBooking={() => setCurrentPage('booking')} />}
          
          {currentPage === 'services' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 max-w-7xl mx-auto pb-20">
              <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-4">Care Services</h1>
                <p className="text-slate-500 text-xl max-w-2xl mx-auto">일상의 품격을 바꾸는 전문가의 손길. 공간에 맞는 맞춤형 서비스를 선택하세요.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: '이사/입주 청소', price: '평당 13,000원~', img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80', desc: '새로운 시작을 위한 완벽한 공간 정돈. 묜지 하나 남지 않도록 구석구석 정공을 다합니다.' },
                  { name: '부분 청소', price: '건당 50,000원~', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80', desc: '주방, 욕실 등 필요한 곳만 집중 케어. 바쁜 일상에서 가장 필요한 실속형 서비스입니다.' },
                  { name: '거주 청소', price: '평당 11,000원~', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80', desc: '살고 있는 집 그대로의 가치를 일깨웁니다. 친환경 세제로 안심까지 배달합니다.' }
                ].map((s, i) => (
                  <div key={i} className="group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
                    <div className="h-72 overflow-hidden relative">
                       <img src={s.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={s.name} />
                       <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-6 py-2 rounded-full font-black text-brand-secondary shadow-lg">
                         {s.price}
                       </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-black mb-4 group-hover:text-brand-secondary transition-colors">{s.name}</h3>
                      <p className="text-slate-400 mb-8 leading-relaxed">{s.desc}</p>
                      <button onClick={() => setCurrentPage('booking')} className="w-full py-4 rounded-2xl bg-brand-surface border-2 border-brand-primary/5 font-black hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                        지금 예약하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'booking' && (
            bookingSuccess ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center gap-6">
                <div className="w-32 h-32 bg-blue-50 text-brand-secondary rounded-sm rotate-45 flex items-center justify-center animate-bounce shadow-xl shadow-blue-500/10">
                  <CheckCircle2 size={64} className="-rotate-45" />
                </div>
                <h1 className="text-4xl font-black text-brand-primary tracking-tighter">예약이 완료되었습니다!</h1>
                <p className="text-slate-500 max-w-md font-medium uppercase tracking-widest text-xs">
                  {user 
                    ? "내역은 마이페이지에서 확인하실 수 있습니다." 
                    : "로그인하시면 나중에 마이페이지에서 내역을 확인하실 수 있습니다."}
                  <br/> 잠시 후 마이페이지로 이동합니다.
                </p>
              </motion.div>
            ) : (
              <BookingPage onComplete={handleBookingComplete} onCancel={() => setCurrentPage('home')} />
            )
          )}

          {currentPage === 'reviews' && <ReviewView />}
          
          {currentPage === 'mypage' && <MyPageView user={user} setCurrentPage={setCurrentPage} />}

          {currentPage === 'admin' && (
             <AdminDashboard user={user} setCurrentPage={setCurrentPage} />
          )}

        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-brand-secondary rounded-sm rotate-45 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-brand-primary uppercase">CLEAN<span className="text-brand-secondary">EXPERT</span></span>
                 </div>
                 <p className="text-slate-500 max-w-sm leading-relaxed text-sm font-medium">
                   CLEANEXPERT는 공간의 가치를 회복하고 바쁜 현대인들에게 진정한 휴식의 시간을 선물하는 프리미엄 홈케어 서비스입니다. 깨끗함을 넘어 안심까지 배달합니다.
                 </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">메뉴</h4>
                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                  <li><button onClick={() => setCurrentPage('home')} className="hover:text-brand-secondary">홈</button></li>
                  <li><button onClick={() => setCurrentPage('services')} className="hover:text-brand-secondary">서비스 소게</button></li>
                  <li><button onClick={() => setCurrentPage('booking')} className="hover:text-brand-secondary">예약하기</button></li>
                  <li><button onClick={() => setCurrentPage('reviews')} className="hover:text-brand-secondary">이용 후기</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">고객지원</h4>
                <ul className="space-y-4 text-slate-500 text-sm font-bold">
                  <li>02-1234-5678</li>
                  <li>help@cleanexpert.com</li>
                  <li>서울시 강남구 테헤란로 123</li>
                </ul>
              </div>
           </div>
           <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">© 2026 CLEANEXPERT INC. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">
               <button className="hover:text-brand-primary transition-colors">이용약관</button>
               <button className="hover:text-brand-primary transition-colors">개인정보 처리방침</button>
            </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
