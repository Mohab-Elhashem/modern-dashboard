"use client";

import { Map, Overlay } from "pigeon-maps";

export interface City {
  id: string;
  name: string;
  position: [number, number];
  targetZoom: number;
}

interface PigeonMapProps {
  center: [number, number];
  zoom: number;
  cities: City[];
  activeCityId: string | null;
  onBoundsChanged: (bounds: { center: [number, number]; zoom: number }) => void;
}

export default function PigeonMap({center,zoom,cities,activeCityId,onBoundsChanged,}: PigeonMapProps) {
  return (
    // map
    <div className="relative h-112.5 overflow-hidden rounded-2xl border md:col-span-2">
      <Map
        height={450}
        center={center}
        zoom={zoom}
        animate={true}
        zoomSnap={false}
        onBoundsChanged={onBoundsChanged}
      >
        {cities.map((city) => (
          <Overlay key={city.id} anchor={city.position} offset={[16, 32]}>
            <div
              className={`text-2xl transition-transform duration-300 ${
                activeCityId === city.id ? "scale-150 animate-bounce" : "opacity-75"
              }`}
            >
              📍
            </div>
          </Overlay>
        ))}
      </Map>
    </div>
  );
}