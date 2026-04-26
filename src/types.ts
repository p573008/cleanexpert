export type Page = 'home' | 'services' | 'booking' | 'reviews' | 'mypage' | 'admin';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export interface BookingData {
  serviceType: string;
  address: string;
  contact: string;
  date: string;
  time: string;
  options: string[];
  totalPrice: number;
}
