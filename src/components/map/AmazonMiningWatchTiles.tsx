import React from "react";
import { TileLayer } from "react-leaflet";
import { MiningOverlay } from "./MiningOverlay";

export const AmazonMiningWatchTiles: React.FC = () => {
  const generateUrl = () => {
    const baseUrl = "https://{s}.tiles.earthindex.ai/v1/tiles/sentinel2";
    const mosaicType = "yearly-mosaics";

    const startDate = `2018-01-01`;
    const endDate = `2024-01-01`;

    return `${baseUrl}-${mosaicType}/${startDate}/${endDate}/rgb/{z}/{x}/{y}.webp`;
  };

  const attribution = `Amazon Mining Watch - Yearly`;

  return (
    <>
      <TileLayer
        url={generateUrl()}
        subdomains={["a", "b", "c"]}
        attribution={attribution}
        tileSize={256}
        maxZoom={18}
      />
      <MiningOverlay />
    </>
  );
};
