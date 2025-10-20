import { useEffect, useState, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchWaybackDates } from "@/lib/waybackUtils";
import { WaybackDate } from "@/types/types";

interface Props {
  selectedDate?: WaybackDate;
  onDateChange: (date: WaybackDate) => void;
}

export const TimelineSlider: React.FC<Props> = ({
  selectedDate,
  onDateChange,
}) => {
  const [availableDates, setAvailableDates] = useState<WaybackDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDates = async () => {
      setIsLoading(true);
      const dates = await fetchWaybackDates();
      setAvailableDates(dates);

      // Set the most recent date as default
      if (dates.length > 0 && !selectedDate) {
        onDateChange(dates[0]);
      }

      setIsLoading(false);
    };

    loadDates();
  }, []);

  // Scroll to selected date when it changes
  useEffect(() => {
    if (selectedDate && scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(
        `[data-release-num="${selectedDate.releaseNum}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedDate]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-[1000] px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4 animate-pulse" />
          <span>Loading historical imagery timeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-[1000]"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 max-w-full">
          {/* Header */}
          <div className="flex items-center gap-2 min-w-[140px] flex-shrink-0">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Selected</span>
              <span className="text-sm font-medium text-gray-700">
                {selectedDate?.releaseDateLabel || "Latest"}
              </span>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => handleScroll("left")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable timeline frames */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto hide-scrollbar flex-1 py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {availableDates.map((date) => {
              const isSelected = selectedDate?.releaseNum === date.releaseNum;
              return (
                <button
                  key={date.releaseNum}
                  data-release-num={date.releaseNum}
                  onClick={() => onDateChange(date)}
                  className={`
                    flex flex-col items-center gap-1 px-2 py-1 rounded-lg border-2 transition-all flex-shrink-0
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                    }
                  `}
                  title={`View imagery from ${date.releaseDateLabel}`}
                >
                  <Calendar
                    className={`w-4 h-4 ${
                      isSelected ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      isSelected ? "text-blue-700" : "text-gray-600"
                    }`}
                  >
                    {date.releaseDateLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => handleScroll("right")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Info text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {availableDates.length} snapshots from{" "}
          {availableDates[availableDates.length - 1]?.releaseDateLabel} to{" "}
          {availableDates[0]?.releaseDateLabel}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
