import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

export const ConfigRow: React.FC<{
  title: string;
  enabled: boolean;
  onClick: () => void;
  lineThroughable: boolean;
}> = ({ title, enabled, lineThroughable, onClick }) => {
  return (
    <li className="flex items-center mb-1">
      <div
        className={cn("w-full font-light text-sm", {
          "line-through": lineThroughable && !enabled,
        })}
      >
        {title}
      </div>
      <span className="cursor-pointer ml-2" onClick={onClick}>
        {enabled ? (
          <EyeIcon className="w-4 h-4" />
        ) : (
          <EyeOffIcon className="w-4 h-4" />
        )}
      </span>
    </li>
  );
};
