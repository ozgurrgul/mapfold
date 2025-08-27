import { PositionInput } from "./PositionInput";
import { MapList } from "./MapList";
import { InterfaceConfigs } from "./InterfaceConfigs";

export function AppSidebar() {
  return (
    <div className="bg-white rounded-md shadow-lg w-full p-4 space-y-4">
      <PositionInput />
      <MapList />
      <InterfaceConfigs />
    </div>
  );
}
