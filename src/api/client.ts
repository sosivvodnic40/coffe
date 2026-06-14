export type ApiMenuCategory = {
  id: string;
  label: string;
  items: {
    id: number;
    name: string;
    description: string;
    price: string;
    priceAmount: number;
  }[];
};

export type ApiLocation = {
  id: string;
  label: string;
  fullAddress: string;
  phone: string;
};

export type ApiAvailabilitySlot = {
  time: string;
  available: boolean;
  remainingCapacity: number;
};

export type ApiReservation = {
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
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
};

export type CreateReservationPayload = {
  locationId: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  comment?: string;
};

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers, ...rest } = options ?? {};
  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fieldErrors = data.details?.fieldErrors as Record<string, string[]> | undefined;
    const messages = fieldErrors ? Object.values(fieldErrors).flat().filter(Boolean) : [];
    throw new Error(messages.length > 0 ? messages.join('. ') : (data.error ?? 'Ошибка сервера'));
  }

  return data as T;
}

export type ApiPromotion = {
  id: number;
  title: string;
  description: string;
  discountLabel: string;
  validUntil: string;
};

export type DashboardStats = {
  totalReservations: number;
  pendingReservations: number;
  confirmedToday: number;
  guestsToday: number;
  menuItemsCount: number;
};

export const api = {
  getMenu: () => request<{ categories: ApiMenuCategory[] }>('/menu'),
  getLocations: () => request<{ locations: ApiLocation[] }>('/locations'),
  getPromotions: () => request<{ promotions: ApiPromotion[] }>('/promotions'),
  getAvailability: (params: { date: string; locationId: string; guests: number }) => {
    const query = new URLSearchParams({
      date: params.date,
      locationId: params.locationId,
      guests: String(params.guests),
    });
    return request<{ slots: ApiAvailabilitySlot[] }>(`/reservations/availability?${query}`);
  },
  createReservation: (payload: CreateReservationPayload) =>
    request<{ message: string; reservation: ApiReservation }>('/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  lookupReservation: (code: string) =>
    request<{ reservation: ApiReservation }>(`/reservations/lookup/${encodeURIComponent(code)}`),
  adminLogin: (email: string, password: string) =>
    request<{ token: string; expiresIn: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  adminStats: (token: string) =>
    request<{ stats: DashboardStats }>('/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  adminReservations: (token: string, status?: string) => {
    const query = status ? `?status=${status}` : '';
    return request<{ reservations: ApiReservation[] }>(`/admin/reservations${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  adminUpdateReservation: (token: string, id: number, status: ApiReservation['status']) =>
    request<{ reservation: ApiReservation }>(`/admin/reservations/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
};
