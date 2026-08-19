"use client";

import { useEffect, useState } from "react";
import PigeonMap, { City } from "@/components/PigeonMap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, MapPin, Trash2 } from "lucide-react";

interface SearchResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

const InitialCities: City[] = [
    { id: "cairo", name: "Cairo", position: [30.0444, 31.2357], targetZoom: 5 },
    { id: "alex", name: "Alex", position: [31.2001, 29.9187], targetZoom: 5 },
    { id: "aswan", name: "Aswan", position: [24.0889, 32.8998], targetZoom: 5 },
];
const DfaultCity = ["cairo", "alex", "aswan"]

export default function Maps() {
    const [cities, setCities] = useState<City[]>(InitialCities);
    const [center, setCenter] = useState<[number, number]>([30.0444, 31.2357]);
    const [zoom, setZoom] = useState<number>(5);
    const [activeCityId, setActiveCityId] = useState<string | null>("cairo");

    // search
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // download from local storage 
    const STORAGE_KEY = "map_cities_data"
    const [isLoaded, setIsLoaded] = useState(false)
    useEffect(() => {
        const savedCities = localStorage.getItem(STORAGE_KEY)
        let parsedCities: City[] | null = null;

        if (savedCities) {
            try {
                const parsed = JSON.parse(savedCities)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    parsedCities = parsed;
                }
            } catch (error) {
                console.error("Error reading localStorage", error)
            }
        }
        // تأجيل التحديث لتجنب الـ Synchronous Cascading Render
        queueMicrotask(() => {
            if (parsedCities) {
                setCities(parsedCities);
            }
            setIsLoaded(true);
        });
    }, []);
    // save any event
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
        }
    }, [cities, isLoaded])

    // choose city
    const handleSelectCity = (city: City) => {
        setCenter(city.position)
        setZoom(city.targetZoom)
        setActiveCityId(city.id)
    };

    // remove city
    const handleDeleteCity = (cityId: string, e: React.MouseEvent) => {
        e.stopPropagation()     // to stop handleSelectCity
        if (DfaultCity.includes(cityId)) return;
        setCities((prev) => {
            const filtered = prev.filter((city) => city.id !== cityId)
            return filtered
        })
    }

    // fetching location
    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };

    // choose city in search
    const handleSelectSearchResult = (item: SearchResult) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const cityName = item.display_name.split(",")[0];
        const newId = `searched-${item.place_id}`;
        const newPosition: [number, number] = [lat, lng];

        const newCity: City = {
            id: newId,
            name: cityName,
            position: newPosition,
            targetZoom: 5,
        };

        // add city in sidebar
        setCities((prev) => {
            const exists = prev.some((c) => c.name.toLowerCase() === cityName.toLowerCase());
            return exists ? prev : [newCity, ...prev];
        });

        // move map to select city
        setCenter(newPosition);
        setZoom(5);
        setActiveCityId(newId);

        // close search list
        setResults([]);
        setQuery(cityName);
    };

    return (
        <div className="space-y-4 p-4">
            {/* Choose Location */}
            <div className="relative w-full max-w-md">
                {/* search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit" disabled={loading} size="icon">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </form>

                {/* search list */}
                {results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
                        {results.map((item) => (
                            <button
                                key={item.place_id}
                                type="button"
                                className="w-full rounded-sm px-3 py-2 text-right text-xs hover:bg-accent block"
                                onClick={() => handleSelectSearchResult(item)}
                            >
                                {item.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* map sidebar */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* cities */}
                <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
                    <h3 className="text-lg font-semibold">Choose Location</h3>
                    <div className="flex flex-col gap-2 max-h-100 overflow-y-auto">
                        {cities.map((city) => {
                            const isDefaultCity = DfaultCity.includes(city.id)
                            return (
                                <div key={city.id} className="group flex items-center gap-1">
                                    {/* city button */}
                                    <button
                                        onClick={() => handleSelectCity(city)}
                                        className={`flex flex-1 items-center justify-between rounded-xl border p-3 text-right text-xs transition-all ${activeCityId === city.id
                                            ? "border-sky-500 bg-sky-500/10 font-medium text-sky-500"
                                            : "bg-background/50 hover:bg-accent"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {city.name}
                                        </span>
                                        <span className="text-[10px] opacity-70">Zoom: {city.targetZoom}</span>
                                    </button>

                                    {/* remove button */}
                                    {!isDefaultCity && <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => handleDeleteCity(city.id, e)}
                                        className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                                        title="Delete city"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>}

                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* map */}
                <PigeonMap
                    center={center}
                    zoom={zoom}
                    cities={cities}
                    activeCityId={activeCityId}
                    onBoundsChanged={({ center, zoom }) => {
                        setCenter(center);
                        setZoom(zoom);
                    }}
                />
            </div>
        </div>
    );
}