import { PositionInput } from "./PositionInput";
import { MapList } from "./MapList";
import { InterfaceConfigs } from "./InterfaceConfigs";
import { BookmarkList } from "./BookmarkList";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  withShadow: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ withShadow }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-md w-full p-4 space-y-4 overflow-y-auto h-[100vh]",
        withShadow && "shadow-lg"
      )}
    >
      <PositionInput />
      <MapList />
      <InterfaceConfigs />
      <BookmarkList />
    </div>
  );
};
