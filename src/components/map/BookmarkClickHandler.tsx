import { useMapEvents, Popup, Marker } from "react-leaflet";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { appActions } from "@/store/appSlice";
import { Bookmark } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import L from "leaflet";

// Create a temporary marker icon
const tempIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const BookmarkClickHandler = () => {
  const dispatch = useDispatch();
  const [clickedPosition, setClickedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [bookmarkName, setBookmarkName] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  useMapEvents({
    click: (e) => {
      setClickedPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
      setBookmarkName("");
      setPopupOpen(true);
    },
  });

  const handleSaveBookmark = () => {
    if (!clickedPosition) return;

    const bookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      name:
        bookmarkName.trim() ||
        `Location at ${clickedPosition.lat.toFixed(
          3
        )}, ${clickedPosition.lng.toFixed(3)}`,
      lat: clickedPosition.lat,
      lng: clickedPosition.lng,
      created: Date.now(),
    };

    dispatch(appActions.addBookmark(bookmark));
    setClickedPosition(null);
    setBookmarkName("");
    setPopupOpen(false);
  };

  const handleCancel = () => {
    setClickedPosition(null);
    setBookmarkName("");
    setPopupOpen(false);
  };

  if (!clickedPosition || !popupOpen) return null;

  return (
    <Marker
      position={[clickedPosition.lat, clickedPosition.lng]}
      icon={tempIcon}
    >
      <Popup
        // @ts-ignore
        onClose={handleCancel}
        autoClose={false}
        closeOnClick={false}
        closeButton={true}
      >
        <div className="p-2 min-w-[200px]">
          <div className="font-semibold text-sm mb-2">
            Bookmark this location?
          </div>
          <div className="text-xs text-gray-600 mb-3">
            {clickedPosition.lat.toFixed(5)}, {clickedPosition.lng.toFixed(5)}
          </div>
          <Input
            type="text"
            placeholder="Bookmark name (optional)"
            value={bookmarkName}
            onChange={(e) => setBookmarkName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSaveBookmark();
              } else if (e.key === "Escape") {
                handleCancel();
              }
            }}
            className="mb-2 h-8 text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSaveBookmark}
              size="sm"
              className="flex-1 h-8"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              className="flex-1 h-8"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
