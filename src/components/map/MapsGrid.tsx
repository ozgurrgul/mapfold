import { selectEnabledMapList } from "@/store/appSelectors";
import { useSelector } from "react-redux";

export const MapsGrid: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mapList = useSelector(selectEnabledMapList);

  // default square grid size
  const gridSize = Math.ceil(Math.sqrt(mapList.length));

  const gridStyles: React.CSSProperties =
    mapList.length === 2
      ? { gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "1fr" } // if only 2 items side-by-side, full height
      : {
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        };

  return (
    <div className={`h-screen w-screen grid gap-1 p-1`} style={gridStyles}>
      {children}
    </div>
  );
};
