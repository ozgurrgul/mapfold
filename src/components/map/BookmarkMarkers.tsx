import { selectBookmarks } from "@/store/appSelectors";
import { useSelector } from "react-redux";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Create a custom bookmark icon
const bookmarkIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export const BookmarkMarkers = () => {
  const bookmarks = useSelector(selectBookmarks);

  return (
    <>
      {bookmarks.map((bookmark) => (
        <Marker
          key={bookmark.id}
          position={[bookmark.lat, bookmark.lng]}
          icon={bookmarkIcon}
        >
          <Popup>
            <div className="p-1">
              <div className="font-semibold text-sm">{bookmark.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {bookmark.lat.toFixed(5)}, {bookmark.lng.toFixed(5)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(bookmark.created).toLocaleDateString()}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

