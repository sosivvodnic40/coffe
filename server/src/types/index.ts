export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Location = {
  id: string;
  label: string;
  fullAddress: string;
  phone: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  priceAmount: number;
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

export type Reservation = {
  id: number;
  confirmationCode: string;
  locationId: string;
  locationLabel: string;
  guestName: string;
  guestPhone: string;
  reservationDate: string;
  reservationTime: string;
  guestsCount: number;
  comment: string | null;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
};

export type AvailabilitySlot = {
  time: string;
  available: boolean;
  remainingCapacity: number;
};

export type DashboardStats = {
  totalReservations: number;
  pendingReservations: number;
  confirmedToday: number;
  guestsToday: number;
  menuItemsCount: number;
};
