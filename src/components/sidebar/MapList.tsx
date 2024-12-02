import { selectMapList } from "@/store/appSelectors";
import { appActions } from "@/store/appSlice";
import { SupportedMapProvider } from "@/types/map";
import { useDispatch, useSelector } from "react-redux";
import { ConfigRow } from "./ConfigRow";

export const MapList = () => {
  const dispatch = useDispatch();
  const mapList = useSelector(selectMapList);

  const onToggleMapEnabled = (provider: SupportedMapProvider) => {
    const element = document.getElementById(`${provider}-map`);

    if (element) {
      element.style.transition = "opacity 0.5s";
      element.style.opacity = "0";

      setTimeout(() => {
        dispatch(appActions.toggleMapEnabled({ provider }));
      }, 500);
    } else {
      dispatch(appActions.toggleMapEnabled({ provider }));
    }
  };

  return (
    <div className="p-4">
      <div className="font-medium">Maps</div>
      <div className="mt-2">
        {mapList.map((m) => (
          <ConfigRow
            key={m.provider}
            title={m.provider}
            enabled={m.enabled}
            lineThroughable
            onClick={() => onToggleMapEnabled(m.provider)}
          />
        ))}
      </div>
    </div>
  );
};
