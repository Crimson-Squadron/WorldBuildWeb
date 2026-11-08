export interface Location {
  id: string;
  name: string;
  description?: string;
  mapX?: number;
  mapY?: number;
  parentLocationId?: string;
}

export interface Faction {
  id: string;
  name: string;
  bannerColor?: string;
  description?: string;
}

export interface Chapter {
  id?: string;
  orderIndex: number;
  chapterTitle: string;
  imageUrl?: string;
  imageCaption?: string;
  content: string;
}

export interface HistoricalEvent {
  id: string;
  title: string;
  synopsis?: string;
  imageUrl?: string;
  eventDate: string; // ISO-8601 (YYYY-MM-DD)
  location?: Location;
  factions: Faction[];
  chapters: Chapter[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventInput {
  title: string;
  synopsis?: string;
  imageUrl?: string;
  eventDate: string;
  locationId?: string;
  factionIds: string[];
  chapters: {
    orderIndex: number;
    chapterTitle: string;
    imageUrl?: string;
    imageCaption?: string;
    content: string;
  }[];
}

export interface CreateLocationInput {
  name: string;
  description?: string;
  mapX?: number;
  mapY?: number;
  parentLocationId?: string;
}

export interface CreateFactionInput {
  name: string;
  bannerColor?: string;
  description?: string;
}
