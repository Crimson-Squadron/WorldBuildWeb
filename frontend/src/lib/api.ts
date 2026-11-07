import { CreateEventInput, CreateFactionInput, CreateLocationInput, Faction, HistoricalEvent, Location } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const PLACEHOLDER_IMAGES = [
  '/placeholders/3347400_64.jpg',
  '/placeholders/3347400_65.jpg',
  '/placeholders/3347400_66.jpg',
  '/placeholders/3347400_67.jpg',
  '/placeholders/3347400_68.jpg',
  '/placeholders/3347400_69.jpg',
];

export interface EventSearchParams {
  search?: string;
  locationId?: string;
  factionIds?: string[];
  fromDate?: string;
  toDate?: string;
  sortBy?: 'eventDate' | 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export async function fetchEvents(params: EventSearchParams = {}): Promise<HistoricalEvent[]> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.locationId) query.append('locationId', params.locationId);
  if (params.factionIds && params.factionIds.length > 0) {
    params.factionIds.forEach((fId) => query.append('factionIds', fId));
  }
  if (params.fromDate) query.append('fromDate', params.fromDate);
  if (params.toDate) query.append('toDate', params.toDate);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortDirection) query.append('sortDirection', params.sortDirection);

  const res = await fetch(`${API_BASE_URL}/events?${query.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchEventById(id: string): Promise<HistoricalEvent> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch event ${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function createEvent(data: CreateEventInput): Promise<HistoricalEvent> {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create event');
  }
  return res.json();
}

export async function updateEvent(id: string, data: CreateEventInput): Promise<HistoricalEvent> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update event');
  }
  return res.json();
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete event: ${res.statusText}`);
  }
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image');
  }
  const data = await res.json();
  return data.url;
}

export async function fetchLocations(): Promise<Location[]> {
  const res = await fetch(`${API_BASE_URL}/locations`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export async function createLocation(data: CreateLocationInput): Promise<Location> {
  const res = await fetch(`${API_BASE_URL}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create location');
  return res.json();
}

export async function fetchFactions(): Promise<Faction[]> {
  const res = await fetch(`${API_BASE_URL}/factions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch factions');
  return res.json();
}

export async function createFaction(data: CreateFactionInput): Promise<Faction> {
  const res = await fetch(`${API_BASE_URL}/factions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create faction');
  return res.json();
}
