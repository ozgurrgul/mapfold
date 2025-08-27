import { useCallback, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPosition } from "./types/map";
import { MapContainer } from "./components/map/MapContainer";
import { MapsGrid } from "./components/map/MapsGrid";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "./store/appSlice";
import { selectEnabledMapList, selectMapPosition } from "./store/appSelectors";
import { MapRenderer } from "./components/map/MapRenderer";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { MenuIcon, XIcon } from "lucide-react";

function App() {
  const dispatch = useDispatch();
  const position = useSelector(selectMapPosition);
  const mapList = useSelector(selectEnabledMapList);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize position from URL on app load
  useEffect(() => {
    dispatch(appActions.initializeFromURL());
  }, [dispatch]);

  const handlePositionChange = useCallback(
    (newPosition: MapPosition) => {
      if (
        newPosition.lat !== position?.lat ||
        newPosition.lng !== position?.lng ||
        newPosition.zoom !== position?.zoom
      ) {
        dispatch(appActions.setMapPosition(newPosition));
      }
    },
    [position, dispatch]
  );

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-[9999] w-[250px] h-screen">
        <div className="flex justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white rounded-md p-2 mb-2"
          >
            {sidebarOpen ? (
              <XIcon className="w-4 h-4" />
            ) : (
              <MenuIcon className="w-4 h-4" />
            )}
          </button>
        </div>
        {sidebarOpen && <AppSidebar />}
      </div>
      <MapsGrid>
        {mapList.map((m) => {
          return (
            <div
              // Lets enforce the length of map because we want to lazily compute map dimensions based on the number of visible maps
              key={`${m.provider}-${mapList.length}`}
              className="w-full h-full"
              id={`${m.provider}-map`}
            >
              <MapContainer
                position={position}
                onPositionChange={handlePositionChange}
              >
                <MapRenderer provider={m.provider} />
              </MapContainer>
            </div>
          );
        })}
      </MapsGrid>
    </div>
  );
}

export default App;
