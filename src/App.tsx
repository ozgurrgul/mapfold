import { useCallback, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapPosition } from "./types/map";
import { MapContainer } from "./components/map/MapContainer";
import { Layout } from "./components/Layout";
import { MapsGrid } from "./components/map/MapsGrid";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "./store/appSlice";
import { selectEnabledMapList, selectMapPosition } from "./store/appSelectors";
import { MapRenderer } from "./components/map/MapRenderer";

function App() {
  const dispatch = useDispatch();
  const position = useSelector(selectMapPosition);
  const mapList = useSelector(selectEnabledMapList);

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
    <Layout>
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
    </Layout>
  );
}

export default App;
