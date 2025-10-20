import { WaybackDate } from "@/types/types";

type WaybackConfigResponse = Record<
  string,
  {
    itemID: string;
    itemTitle: string;
    itemURL: string;
    metadataLayerUrl: string;
    metadataLayerItemID: string;
    layerIdentifier: string;
  }
>;

/**
 * Fetches available ESRI World Imagery Wayback dates
 * Data comes from ESRI's public configuration endpoint
 */
export async function fetchWaybackDates(): Promise<WaybackDate[]> {
  try {
    const response = await fetch(
      "https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch wayback dates");
    }

    const data: WaybackConfigResponse = await response.json();

    // Transform ESRI's object format to our WaybackDate array
    const dates: WaybackDate[] = Object.entries(data).map(
      ([releaseNum, item]) => {
        // Parse date from itemTitle: "World Imagery (Wayback 2025-09-25)"
        const dateMatch = item?.itemTitle?.match(
          /\(Wayback (\d{4}-\d{2}-\d{2})\)/
        );
        const dateStr = dateMatch ? dateMatch[1] : "";

        // Convert to timestamp
        const releaseDate = dateStr ? new Date(dateStr).getTime() : 0;

        // Format label (e.g., "Sep 2025")
        const releaseDateLabel = dateStr
          ? new Date(dateStr).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : `Release ${releaseNum}`;

        // Convert ESRI's WMTS URL format {level}/{row}/{col} to Leaflet's {z}/{y}/{x}
        const tileUrl = item.itemURL
          .replace("{level}", "{z}")
          .replace("{row}", "{y}")
          .replace("{col}", "{x}");

        return {
          releaseNum: parseInt(releaseNum),
          releaseDateLabel,
          releaseDate,
          tileUrl,
        };
      }
    );

    // Sort by date descending (newest first)
    return dates.sort((a, b) => b.releaseDate - a.releaseDate);
  } catch (error) {
    console.error("Error fetching wayback dates:", error);
    return [];
  }
}
