import { createLayerComponent } from "@react-leaflet/core";
import L from "leaflet";

const URL =
  "https://ecn.t{s}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=1234";

// Custom TileLayer class to handle quadkey
const CustomTileLayer = createLayerComponent(
  // @ts-ignore
  (props) => {
    const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
    const tileLayer = new L.TileLayer(URL, {
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      tms: true,
      attribution: "Bing",
    });

    // Override the getTileUrl function
    tileLayer.getTileUrl = (coords) => {
      const quadKey = toQuadKey(coords.x, coords.y, coords.z);
      const s = String(Math.floor(Math.random() * (subdomains?.length || 1)));
      return URL.replace("{s}", s).replace("{quadkey}", quadKey);
    };

    return {
      instance: tileLayer,
      context: null,
    };
  },
  (layer) => {
    layer.setUrl(URL);
  }
);

// Convert tile coordinates to Microsoft QuadKey
function toQuadKey(x: number, y: number, z: number): string {
  let quadKey = "";
  for (let i = z; i > 0; i--) {
    let digit = 0;
    const mask = 1 << (i - 1);
    if ((x & mask) !== 0) digit += 1;
    if ((y & mask) !== 0) digit += 2;
    quadKey += digit;
  }
  return quadKey;
}

export function BingMap() {
  return <CustomTileLayer />;
}
