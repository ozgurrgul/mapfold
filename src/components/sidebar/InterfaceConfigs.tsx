import { selectConfigs } from "@/store/appSelectors";
import { appActions } from "@/store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { ConfigRow } from "./ConfigRow";
import {
  BusFront,
  PersonStanding,
  RulerIcon,
  TentIcon,
  TrainIcon,
  Info,
} from "lucide-react";

export const InterfaceConfigs = () => {
  const dispatch = useDispatch();
  const configs = useSelector(selectConfigs);

  return (
    <div>
      <div>Configs</div>
      <div className="mt-2 rounded-md overflow-hidden border border-gray-100">
        <ConfigRow
          title="Google Street View"
          enabled={configs.showGoogleStreetView}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showGoogleStreetView" }))
          }
          icon={<PersonStanding className="w-4 h-4" />}
        />
        <ConfigRow
          title="Roads"
          enabled={configs.showRoads}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showRoads" }))
          }
          icon={<BusFront className="w-4 h-4" />}
        />
        <ConfigRow
          title="Indigenous territories"
          enabled={configs.showIndigenousTerritories}
          lineThroughable={false}
          onClick={() =>
            dispatch(
              appActions.toggleConfig({ key: "showIndigenousTerritories" })
            )
          }
          icon={<TentIcon className="w-4 h-4" />}
        />
        <ConfigRow
          title="Railways"
          enabled={configs.showRailways}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showRailways" }))
          }
          icon={<TrainIcon className="w-4 h-4" />}
        />
        <ConfigRow
          title="Measure control"
          enabled={configs.showMeasureControl}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showMeasureControl" }))
          }
          icon={<RulerIcon className="w-4 h-4" />}
        />
        <ConfigRow
          title="Weather Info"
          enabled={configs.showWeatherInfo}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showWeatherInfo" }))
          }
          icon={<Info className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};
