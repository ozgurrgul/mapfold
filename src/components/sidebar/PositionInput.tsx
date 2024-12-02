import { selectMapPosition } from "@/store/appSelectors";
import { useDispatch, useSelector } from "react-redux";
import { SidebarInput } from "../ui/sidebar";
import { MapPosition } from "@/types/map";
import { appActions } from "@/store/appSlice";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";

export const PositionInput = () => {
  const position = useSelector(selectMapPosition);
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState(
    `${position.lat},${position.lng}`
  );
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const parsePosition = (value: string): Pick<MapPosition, "lat" | "lng"> => {
    const [lat, lng] = value.trim().split(",");
    return {
      lat: parseFloat(lat.trim()),
      lng: parseFloat(lng.trim()),
    };
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue) {
      const parsed = parsePosition(debouncedValue);
      if (parsed.lat && parsed.lng) {
        dispatch(appActions.setMapPosition(parsed));
      }
    }
  }, [debouncedValue, dispatch]);

  return (
    <>
      <Label htmlFor="coordinates">GPS coordinates</Label>
      <SidebarInput
        id="coordinates"
        placeholder="Coordinates"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </>
  );
};
