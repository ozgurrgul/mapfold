import { SupportedMapProvider } from "@/types/map";
import { TileLayer } from "react-leaflet";
import { BingMap } from "./BingMap";
import { GoogleStreetView } from "./StreetView";
import { AmazonMiningWatchTiles } from "./AmazonMiningWatchTiles";
import { EsriWaybackMap } from "./EsriWaybackMap";
import { NasaGibsMap } from "./NasaGibsMap";

const maps: Record<SupportedMapProvider, React.ReactNode> = {
  googleSat: (
    <TileLayer
      url="https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      subdomains={["0", "1", "2", "3"]}
      attribution="Google Satellite"
      maxZoom={50}
    />
  ),
  googleRoads: (
    <TileLayer
      url="http://mt0.google.com/vt/lyrs=h&hl=en&x={x}&y={y}&z={z}&s=Ga"
      subdomains={["0", "1", "2", "3"]}
      attribution="Google roads"
      maxZoom={50}
    />
  ),
  googleTerrain: (
    <TileLayer
      url="http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga"
      subdomains={["0", "1", "2", "3"]}
      attribution="Google terrain"
      maxZoom={50}
    />
  ),
  googleStreet: <GoogleStreetView />,
  yandexSat: (
    <TileLayer
      url="https://core-sat.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}"
      attribution="Yandex Satellite"
      tileSize={256}
      maxZoom={50}
    />
  ),
  bingSat: <BingMap />,
  esriSat: (
    <TileLayer
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      attribution="ESRI"
      maxZoom={50}
    />
  ),
  esriSatTimeline: <EsriWaybackMap />,
  amazonMiningWatch: <AmazonMiningWatchTiles />,
  topography: (
    <TileLayer
      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      attribution="OpenTopoMap"
      maxZoom={50}
    />
  ),
  airports: (
    <TileLayer
      url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
      attribution={`Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
      maxZoom={50}
    />
  ),
  railways: (
    <TileLayer
      url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
      attribution={`Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)`}
      maxZoom={50}
    />
  ),
  nasaGibs: <NasaGibsMap />,
};

export const MapRenderer: React.FC<{ provider: SupportedMapProvider }> = ({
  provider,
}) => {
  return maps[provider];
};
