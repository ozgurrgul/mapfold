import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";

export const ConfigRow: React.FC<{
  title: string;
  enabled: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}> = ({ title, enabled, onClick, icon }) => {
  return (
    <li
      className={cn(
        "flex items-center hover:text-[#027B8B] cursor-pointer p-1 rounded-md mt-1",
        enabled ? "bg-[#027B8B]/25 text-[#027B8B]" : ""
      )}
      onClick={onClick}
    >
      <div className={cn("w-full font-light text-sm flex items-center gap-2")}>
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
