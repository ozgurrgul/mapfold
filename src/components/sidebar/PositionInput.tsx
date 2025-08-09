import { selectMapPosition } from "@/store/appSelectors";
import { useDispatch, useSelector } from "react-redux";
import { SidebarInput } from "../ui/sidebar";
import { MapPosition } from "@/types/map";
import { appActions } from "@/store/appSlice";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

export const PositionInput = () => {
  const position = useSelector(selectMapPosition);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (position) {
      setInputValue(`${position.lat},${position.lng}`);
    }
  }, [position]);

  const parsePosition = (
    value: string
  ): Pick<MapPosition, "lat" | "lng"> | null => {
    const [lat, lng] = value.trim().split(",");
    if (!lat || !lng) return null;
    return {
      lat: parseFloat(lat.trim()),
      lng: parseFloat(lng.trim()),
    };
  };

  const handleApply = () => {
    const parsed = parsePosition(inputValue);
    if (parsed && !isNaN(parsed.lat) && !isNaN(parsed.lng)) {
      dispatch(appActions.setMapPosition(parsed));
    }
  };

  return (
    <>
      <Label htmlFor="coordinates">GPS coordinates</Label>
      <div className="flex gap-2">
        <SidebarInput
          id="coordinates"
          placeholder="lat,lng"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleApply} size="sm">
          Apply
        </Button>
      </div>
    </>
  );
};
