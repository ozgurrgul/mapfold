import { useState } from "react";
import { Calendar, Satellite, ChevronDown } from "lucide-react";
import { GIBS_LAYERS } from "./NasaGibsConstants";
import { getYesterdayDate } from "@/lib/dateUtils";

interface NasaGibsLayerSelectorProps {
  onLayerChange?: (layer: string) => void;
  onDateChange?: (date: string) => void;
  className?: string;
}

const LAYER_NAMES = {
  [GIBS_LAYERS.MODIS_TERRA_TRUE_COLOR]: "MODIS Terra True Color",
  [GIBS_LAYERS.MODIS_AQUA_TRUE_COLOR]: "MODIS Aqua True Color",
  [GIBS_LAYERS.VIIRS_SNPP_TRUE_COLOR]: "VIIRS SNPP True Color",
  [GIBS_LAYERS.MODIS_TERRA_BANDS721]: "MODIS Terra Bands 7-2-1",
  [GIBS_LAYERS.MODIS_AQUA_BANDS721]: "MODIS Aqua Bands 7-2-1",
  [GIBS_LAYERS.LANDSAT_WELD_TRUE_COLOR]: "Landsat WELD True Color",
} as const;

export const NasaGibsLayerSelector: React.FC<NasaGibsLayerSelectorProps> = ({
  onLayerChange,
  onDateChange,
  className = "",
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>(
    GIBS_LAYERS.MODIS_TERRA_TRUE_COLOR
  );
  const [selectedDate, setSelectedDate] = useState(getYesterdayDate());
  const [isLayerOpen, setIsLayerOpen] = useState(false);

  const handleLayerChange = (layer: string) => {
    setSelectedLayer(layer);
    setIsLayerOpen(false);
    onLayerChange?.(layer);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 max-w-full">
          {/* Header */}
          <div className="flex items-center gap-2 min-w-[140px] flex-shrink-0">
            <Satellite className="w-4 h-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">NASA GIBS</span>
              <span className="text-sm font-medium text-gray-700">
                {LAYER_NAMES[selectedLayer as keyof typeof LAYER_NAMES]
                  ?.split(" ")
                  .slice(0, 2)
                  .join(" ") || "MODIS Terra"}
              </span>
            </div>
          </div>

          {/* Layer Selector */}
          <div className="relative flex-1 max-w-[200px]">
            <button
              onClick={() => setIsLayerOpen(!isLayerOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="truncate">
                {LAYER_NAMES[selectedLayer as keyof typeof LAYER_NAMES] ?? "-"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isLayerOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLayerOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {Object.entries(LAYER_NAMES).map(([layerId, layerName]) => (
                  <button
                    key={layerId}
                    onClick={() => handleLayerChange(layerId)}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 ${
                      selectedLayer === layerId
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {layerName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              max={getYesterdayDate()}
              className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleDateChange(getYesterdayDate())}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700 whitespace-nowrap"
            >
              Latest
            </button>
          </div>
        </div>

        {/* Info text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          NASA satellite imagery • Updated within 3.5 hours of observation
        </div>
      </div>
    </div>
  );
};
