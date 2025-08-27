import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

export const ConfigRow: React.FC<{
  title: string;
  enabled: boolean;
  onClick: () => void;
  lineThroughable: boolean;
  icon?: React.ReactNode;
}> = ({ title, enabled, lineThroughable, onClick, icon }) => {
  return (
    <li
      className={cn(
        "flex items-center hover:bg-gray-100/2 cursor-pointer p-1",
        enabled ? "bg-green-100/75" : "bg-gray-100"
      )}
      onClick={onClick}
    >
      <div
        className={cn("w-full font-light text-sm flex items-center gap-2", {
          "line-through": lineThroughable && !enabled,
        })}
      >
        {icon}
        {title}
      </div>
      <span className="cursor-pointer ml-2">
        {enabled ? (
          <EyeIcon className="w-4 h-4" />
        ) : (
          <EyeOffIcon className="w-4 h-4" />
        )}
      </span>
    </li>
  );
};
