import { selectConfigs } from "@/store/appSelectors";
import { appActions } from "@/store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { ConfigRow } from "./ConfigRow";

export const InterfaceConfigs = () => {
  const dispatch = useDispatch();
  const configs = useSelector(selectConfigs);

  return (
    <div className="p-4">
      <div className="font-medium">Configs</div>
      <div className="mt-2">
        <ConfigRow
          title="Show Google Street View"
          enabled={configs.showGoogleStreetView}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showGoogleStreetView" }))
          }
        />
        <ConfigRow
          title="Show roads"
          enabled={configs.showRoads}
          lineThroughable={false}
          onClick={() =>
            dispatch(appActions.toggleConfig({ key: "showRoads" }))
          }
        />
      </div>
    </div>
  );
};
