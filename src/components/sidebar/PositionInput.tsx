import { selectMapPosition } from "@/store/appSelectors";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { MapPosition } from "@/types/map";
import { appActions } from "@/store/appSlice";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, Navigation, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
}

export const PositionInput = () => {
  const position = useSelector(selectMapPosition);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (position) {
      setInputValue(`${position.lat.toFixed(6)},${position.lng.toFixed(6)}`);
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parsePosition = (
    value: string
  ): Pick<MapPosition, "lat" | "lng"> | null => {
    const [lat, lng] = value.trim().split(",");
    if (!lat || !lng) return null;
    const parsedLat = parseFloat(lat.trim());
    const parsedLng = parseFloat(lng.trim());
    if (isNaN(parsedLat) || isNaN(parsedLng)) return null;
    return { lat: parsedLat, lng: parsedLng };
  };

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            "User-Agent": "MapFold App",
          },
        }
      );
      const data: NominatimResult[] = await response.json();
      setSearchResults(data);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Address search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Check if input looks like coordinates
    const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
    if (coordPattern.test(value.trim())) {
      setSearchResults([]);
      setShowResults(false);
      // Auto-apply valid coordinates
      const parsed = parsePosition(value);
      if (parsed) {
        dispatch(appActions.setMapPosition(parsed));
      }
      return;
    }

    // Debounce address search
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 400);
  };

  const handleSelectResult = (result: NominatimResult) => {
    const newPosition = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
    dispatch(appActions.setMapPosition(newPosition));
    setInputValue(`${newPosition.lat.toFixed(6)},${newPosition.lng.toFixed(6)}`);
    setShowResults(false);
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showResults && searchResults.length > 0 && selectedIndex >= 0) {
        handleSelectResult(searchResults[selectedIndex]);
      } else if (showResults && searchResults.length > 0) {
        handleSelectResult(searchResults[0]);
      } else {
        const parsed = parsePosition(inputValue);
        if (parsed) {
          dispatch(appActions.setMapPosition(parsed));
          setShowResults(false);
        }
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
      setSelectedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }
  };

  const isCoordinates = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/.test(
    inputValue.trim()
  );

  return (
    <div ref={containerRef} className="relative space-y-2">
      <div className="relative">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isCoordinates ? (
            <Navigation className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <Input
          ref={inputRef}
          id="location-search"
          placeholder="Search location or 40.7128,-74.0060"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true);
          }}
          className="pl-8 pr-8 h-9 text-sm"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={result.place_id}
                onClick={() => handleSelectResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "w-full px-2.5 py-2 text-left text-xs flex items-start gap-2 transition-colors border-b last:border-b-0",
                  selectedIndex === index
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                )}
              >
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <span className="flex-1 line-clamp-2">
                  {result.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {!showResults && (
        <div className="text-[10px] text-muted-foreground leading-tight">
          Type address or paste coordinates
        </div>
      )}
    </div>
  );
};
