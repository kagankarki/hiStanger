export interface DatePlan {
  /** ISO date string, e.g. "2026-09-20" */
  date: string;
  /** 24h time string, e.g. "19:30" */
  time: string;
  /** Human-readable place label chosen on the map */
  place: string;
  /** Latitude of the chosen place */
  lat: number | null;
  /** Longitude of the chosen place */
  lng: number | null;
  /** Ready-to-open Google Maps link for the chosen place */
  mapsUrl: string | null;
  /** When the plan was submitted, ISO timestamp */
  createdAt: string;
}

export interface SelectedPlace {
  name: string;
  lat: number;
  lng: number;
}
