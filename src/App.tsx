import { useCallback, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPosition } from "./types/map";
import { MapContainer } from "./components/map/MapContainer";
import { MapsGrid } from "./components/map/MapsGrid";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "./store/appSlice";
import {
  selectEnabledMapList,
  selectMapPosition,
  selectFullscreenProvider,
  selectConfigs,
} from "./store/appSelectors";
import { MapRenderer } from "./components/map/MapRenderer";
import { AppSidebar } from "./components/sidebar/AppSidebar";
import { FullscreenToggle } from "./components/ui/fullscreen-toggle";
import { WeatherInfo } from "./components/weather/WeatherInfo";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { MenuIcon, XIcon } from "lucide-react";

function App() {
  const dispatch = useDispatch();
  const position = useSelector(selectMapPosition);
  const mapList = useSelector(selectEnabledMapList);
  const fullscreenProvider = useSelector(selectFullscreenProvider);
  const configs = useSelector(selectConfigs);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize position from URL on app load
  useEffect(() => {
    dispatch(appActions.initializeFromURL());
  }, [dispatch]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "Escape",
      callback: () => {
        if (fullscreenProvider) {
          dispatch(appActions.setFullscreenProvider(undefined));
        }
      },
    },
  ]);

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

  const canShowSidebarIcon = !fullscreenProvider;

  return (
    <div className="relative">
      {canShowSidebarIcon && (
        <div className="absolute top-4 right-4 z-[9999] w-[250px]">
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
          <div 
            className={`transition-all duration-300 ease-out origin-top-right ${
              sidebarOpen 
                ? 'transform scale-100 opacity-100' 
                : 'transform scale-0 opacity-0 pointer-events-none'
            }`}
          >
            <AppSidebar />
          </div>
        </div>
      )}
      <MapsGrid>
        {mapList
          .filter(
            (m) => !fullscreenProvider || m.provider === fullscreenProvider
          )
          .map((m) => {
            return (
              <div
                // Lets enforce the length of map because we want to lazily compute map dimensions based on the number of visible maps
                key={`${m.provider}-${
                  fullscreenProvider ? "fullscreen" : mapList.length
                }`}
                className="w-full h-full relative"
                id={`${m.provider}-map`}
              >
                <MapContainer
                  position={position}
                  onPositionChange={handlePositionChange}
                >
                  <MapRenderer provider={m.provider} />
                </MapContainer>
                <FullscreenToggle
                  isFullscreen={fullscreenProvider === m.provider}
                  onToggle={() =>
                    dispatch(appActions.toggleFullscreen(m.provider))
                  }
                />
                {configs.showWeatherInfo && (
                  <WeatherInfo 
                    position={position} 
                    className="absolute top-24 left-4 max-w-[200px]"
                  />
                )}
              </div>
            );
          })}
      </MapsGrid>
    </div>
  );
}

export default App;
