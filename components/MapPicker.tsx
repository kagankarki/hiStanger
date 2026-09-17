"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { SelectedPlace } from "@/lib/types";

// İstanbul — açılışta haritanın ortalanacağı yer.
const DEFAULT_CENTER: [number, number] = [41.0082, 28.9784];

const PIN_SVG = `
<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 0C7.7 0 1 6.7 1 15c0 10.5 13 25.2 14.1 26.4a1.2 1.2 0 0 0 1.8 0C18 40.2 31 25.5 31 15 31 6.7 24.3 0 16 0Z" fill="#503c2c"/>
  <circle cx="16" cy="15" r="6" fill="#fbf9f6"/>
</svg>`;

/** Turns a long Nominatim display name into a short 2-part label. */
function shortLabel(displayName: string): string {
  return displayName
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export default function MapPicker({
  onSelect,
}: {
  onSelect: (place: SelectedPlace | null) => void;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  // ---- Leaflet map setup (client-only) ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(mapEl.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView(DEFAULT_CENTER, 12);

      // Esri "Light Gray Canvas" — a minimal, keyless light basemap that fits
      // the clean aesthetic far better than the busy default OSM tiles.
      // Base (shapes) + reference (labels) as two layers.
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16, attribution: "Tiles &copy; Esri" }
      ).addTo(map);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16 }
      ).addTo(map);

      map.on("click", (e: { latlng: { lat: number; lng: number } }) =>
        placeAt(e.latlng.lat, e.latlng.lng, true)
      );

      mapRef.current = map;
      // Card animates in — recompute size once it has settled.
      setTimeout(() => map.invalidateSize(), 300);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMarker = (lat: number, lng: number) => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      return;
    }
    const icon = L.divIcon({
      html: PIN_SVG,
      className: "",
      iconSize: [32, 42],
      iconAnchor: [16, 40],
    });
    const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const p = marker.getLatLng();
      placeAt(p.lat, p.lng, true);
    });
    markerRef.current = marker;
  };

  const placeAt = async (lat: number, lng: number, doReverse: boolean) => {
    setMarker(lat, lng);
    mapRef.current?.panTo([lat, lng]);

    let name = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    if (doReverse) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=tr`
        );
        const data = await res.json();
        if (data?.display_name) name = shortLabel(data.display_name);
      } catch {
        /* keep coordinate label */
      }
    }
    setSelectedName(name);
    onSelect({ name, lat, lng });
  };

  const choose = (r: NominatimResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    const name = shortLabel(r.display_name);
    setResults([]);
    setQuery("");
    mapRef.current?.setView([lat, lng], 15);
    setMarker(lat, lng);
    setSelectedName(name);
    onSelect({ name, lat, lng });
  };

  // ---- Debounced place search (Nominatim / OpenStreetMap) ----
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            query
          )}&limit=5&accept-language=tr`
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-espresso-600">
        Mekan
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yer ara (kafe, restoran, adres)…"
          className="focus-ring w-full rounded-2xl border border-espresso-200 bg-white/80 px-4 py-3 text-espresso-800 outline-none transition placeholder:text-espresso-500/50"
        />
        {searching && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-espresso-500">
            aranıyor…
          </span>
        )}

        {results.length > 0 && (
          <ul className="glass absolute left-0 right-0 top-[calc(100%+6px)] z-[1200] max-h-56 overflow-auto rounded-2xl p-1.5">
            {results.map((r, i) => (
              <li key={`${r.lat}-${r.lon}-${i}`}>
                <button
                  type="button"
                  onClick={() => choose(r)}
                  className="focus-ring block w-full truncate rounded-xl px-3 py-2 text-left text-sm text-espresso-700 hover:bg-espresso-100/70"
                  title={r.display_name}
                >
                  {shortLabel(r.display_name)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        ref={mapEl}
        className="mt-3 h-64 w-full overflow-hidden rounded-2xl border border-espresso-200 shadow-inner"
        role="application"
        aria-label="Konum seçme haritası"
      />

      <p className="mt-2 text-xs text-espresso-500">
        Haritaya dokunarak ya da işaretçiyi sürükleyerek de seçebilirsin.
      </p>

      {selectedName && (
        <div className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-espresso-700 bg-espresso-700 px-3.5 py-1.5 text-sm text-cream-50">
          <span aria-hidden>📍</span>
          <span className="truncate">{selectedName}</span>
        </div>
      )}
    </div>
  );
}
