import { selectConfigs } from "@/store/appSelectors";
import { appActions } from "@/store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { ConfigRow } from "./ConfigRow";
import {
  BusFront,
  Navigation,
  RulerIcon,
  TentIcon,
  TrainIcon,
  CloudSun,
  Layers,
  Wrench,
  Waves,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const InterfaceConfigs = () => {
  const dispatch = useDispatch();
  const configs = useSelector(selectConfigs);
  const [overlaysOpen, setOverlaysOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);

  return (
    <div className="space-y-3">
      {/* Map Overlays Section */}
      <Collapsible open={overlaysOpen} onOpenChange={setOverlaysOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold hover:text-primary transition-colors group">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Map Overlays</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              overlaysOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 rounded-md overflow-hidden border">
            <ConfigRow
              title="Roads"
              enabled={configs.showRoads}
              onClick={() =>
                dispatch(appActions.toggleConfig({ key: "showRoads" }))
              }
              icon={<BusFront className="w-4 h-4" />}
            />
            <ConfigRow
              title="Railways"
              enabled={configs.showRailways}
              onClick={() =>
                dispatch(appActions.toggleConfig({ key: "showRailways" }))
              }
              icon={<TrainIcon className="w-4 h-4" />}
            />
            <ConfigRow
              title="Indigenous Territories"
              enabled={configs.showIndigenousTerritories}
              onClick={() =>
                dispatch(
                  appActions.toggleConfig({ key: "showIndigenousTerritories" })
                )
              }
              icon={<TentIcon className="w-4 h-4" />}
            />
            <ConfigRow
              title="Earthquakes (24h, M4.0+)"
              enabled={configs.showEarthquakes}
              onClick={() =>
                dispatch(appActions.toggleConfig({ key: "showEarthquakes" }))
              }
              icon={<Waves className="w-4 h-4" />}
            />
            <ConfigRow
              title="Street View"
              enabled={configs.showGoogleStreetView}
              onClick={() =>
                dispatch(
                  appActions.toggleConfig({ key: "showGoogleStreetView" })
                )
              }
              icon={<Navigation className="w-4 h-4" />}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Tools Section */}
      <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold hover:text-primary transition-colors group">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>Tools & Features</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              toolsOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 rounded-md overflow-hidden border">
            <ConfigRow
              title="Measure Tool"
              enabled={configs.showMeasureControl}
              onClick={() =>
                dispatch(appActions.toggleConfig({ key: "showMeasureControl" }))
              }
              icon={<RulerIcon className="w-4 h-4" />}
            />
            <ConfigRow
              title="Weather Info"
              enabled={configs.showWeatherInfo}
              onClick={() =>
                dispatch(appActions.toggleConfig({ key: "showWeatherInfo" }))
              }
              icon={<CloudSun className="w-4 h-4" />}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
