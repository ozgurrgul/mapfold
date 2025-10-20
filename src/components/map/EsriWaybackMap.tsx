import { TileLayer } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { TimelineSlider } from "../timeline/TimelineSlider";
import { selectSelectedEsriSatTimelineDate } from "@/store/appSelectors";
import { WaybackDate } from "@/types/types";
import { appActions } from "@/store/appSlice";

export const EsriWaybackMap: React.FC = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedEsriSatTimelineDate);

  // If no date is selected, show current imagery as fallback
  const url = selectedDate
    ? selectedDate.tileUrl
    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const attribution = selectedDate
    ? `ESRI Wayback (${selectedDate.releaseDateLabel})`
    : "ESRI";

  const handleDateChange = (date: WaybackDate) => {
    dispatch(appActions.setEsriSatTimelineDate(date));
  };

  return (
    <>
      <TileLayer
        key={`wayback-${selectedDate?.releaseNum || "current"}`}
        url={url}
        attribution={attribution}
        maxZoom={50}
        // Force tile refresh when URL changes
        updateWhenIdle={false}
        updateWhenZooming={false}
        keepBuffer={0}
      />
      <TimelineSlider
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </>
  );
};
