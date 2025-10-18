import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface FullscreenToggleProps {
  isFullscreen: boolean;
  onToggle: () => void;
  className?: string;
}

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  isFullscreen,
  onToggle,
  className = "",
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggle}
            className={`absolute bottom-2 left-2 z-[1000] bg-white/90 hover:bg-white shadow-md ${className}`}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
