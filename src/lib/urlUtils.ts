import { MapPosition, SupportedMapProvider } from "@/types/map";
import { Configs, URLParams } from "@/types/types";

export const parseURLParams = (): URLParams => {
  const params = new URLSearchParams(window.location.search);
  const mapPositionParam = params.get("mapPosition");
  const configsParam = params.get("configs");
  const enabledProvidersParam = params.get("enabledProviders");

  const result: URLParams = {};

  // Parse map position from JSON
  if (mapPositionParam) {
    try {
      const mapPosition = JSON.parse(decodeURIComponent(mapPositionParam));
      if (mapPosition && typeof mapPosition === "object") {
        result.mapPosition = mapPosition;
      }
    } catch (error) {
      console.warn("Failed to parse mapPosition from URL:", error);
    }
  }

  // Parse configs from JSON
  if (configsParam) {
    try {
      const configs = JSON.parse(decodeURIComponent(configsParam));
      if (configs && typeof configs === "object") {
        result.configs = configs;
      }
    } catch (error) {
      console.warn("Failed to parse configs from URL:", error);
    }
  }

  // Parse enabled providers (keep as comma-separated for simplicity)
  if (enabledProvidersParam) {
    const providersList = enabledProvidersParam
      .split(",")
      .filter(Boolean) as SupportedMapProvider[];
    if (providersList.length > 0) {
      result.enabledProviders = providersList;
    }
  }

  return result;
};

export const updateURL = (
  position: MapPosition,
  configs?: Configs,
  enabledProviders?: SupportedMapProvider[]
) => {
  const params = new URLSearchParams();

  // Add map position as JSON
  params.set("mapPosition", encodeURIComponent(JSON.stringify(position)));

  // Add configs as JSON if provided
  if (configs && Object.keys(configs).length > 0) {
    params.set("configs", encodeURIComponent(JSON.stringify(configs)));
  }

  // Add enabled providers as comma-separated list
  if (enabledProviders && enabledProviders.length > 0) {
    params.set("enabledProviders", enabledProviders.join(","));
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newURL);
};
