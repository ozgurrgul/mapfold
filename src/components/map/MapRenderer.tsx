import { SupportedMapProvider } from "@/types/map";
import { TileLayer } from "react-leaflet";
import { BingMap } from "./BingMap";
import { GoogleStreetView } from "./StreetView";
import { AmazonMiningWatchTiles } from "./AmazonMiningWatchTiles";

const maps: Record<SupportedMapProvider, React.ReactNode> = {
  googleSat: (
    <TileLayer
      url="https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      subdomains={["0", "1", "2", "3"]}
      attribution="Google Satellite"
    />
  ),
  googleRoads: (
    <TileLayer
      url="http://mt0.google.com/vt/lyrs=h&hl=en&x={x}&y={y}&z={z}&s=Ga"
      subdomains={["0", "1", "2", "3"]}
      attribution="Google roads"
    />
  ),
  googleTerrain: (
    <TileLayer
      url="http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga"
      subdomains={["0", "1", "2", "3"]}
      attribution="Google terrain"
    />
  ),
  googleStreet: <GoogleStreetView />,
  yandexSat: (
    <TileLayer
      url="https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}"
      attribution="Yandex Satellite"
      tileSize={256}
    />
  ),
  bingSat: <BingMap />,
  esriSat: (
    <TileLayer
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      attribution="ESRI"
    />
  ),
  amazonMiningWatch: <AmazonMiningWatchTiles />,
  topography: (
    <TileLayer
      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      attribution="OpenTopoMap"
    />
  ),
  airports: (
    <TileLayer
      url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
      attribution={`Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
    />
  ),
};

export const MapRenderer: React.FC<{ provider: SupportedMapProvider }> = ({
  provider,
}) => {
  return maps[provider];
};
