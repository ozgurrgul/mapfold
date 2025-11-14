import { selectBookmarks, selectMapPosition } from "@/store/appSelectors";
import { appActions } from "@/store/appSlice";
import { Bookmark } from "@/types/types";
import {
  MapPinIcon,
  TrashIcon,
  EditIcon,
  CheckIcon,
  XIcon,
  StarIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const BookmarkList = () => {
  const dispatch = useDispatch();
  const bookmarks = useSelector(selectBookmarks);
  const position = useSelector(selectMapPosition);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleRemoveBookmark = (id: string) => {
    dispatch(appActions.removeBookmark(id));
  };

  const handleGoToBookmark = (bookmark: Bookmark) => {
    dispatch(
      appActions.setMapPosition({
        lat: bookmark.lat,
        lng: bookmark.lng,
        zoom: position?.zoom || 10,
      })
    );
  };

  const handleStartEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditingName(bookmark.name);
  };

  const handleSaveEdit = (bookmark: Bookmark) => {
    if (editingName.trim()) {
      dispatch(
        appActions.updateBookmark({
          ...bookmark,
          name: editingName.trim(),
        })
      );
    }
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 font-semibold text-sm">
        <StarIcon className="w-4 h-4" />
        <span>My Bookmarks</span>
      </div>

      {/* Info text */}
      <div className="mb-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
        Click anywhere on the map to bookmark a location
      </div>

      {/* Bookmark list */}
      <div className="rounded-md overflow-hidden border border-gray-100">
        {bookmarks.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No bookmarks yet. Click on the map to add one!
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center gap-2 p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              {editingId === bookmark.id ? (
                <>
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEdit(bookmark);
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    className="flex-1 h-7 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(bookmark)}
                    className="text-green-600 hover:text-green-700 p-1"
                    title="Save"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-600 hover:text-gray-700 p-1"
                    title="Cancel"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleGoToBookmark(bookmark)}
                    className="flex-1 flex items-center gap-2 text-left hover:text-blue-600 transition-colors min-w-0"
                    title={`Go to ${bookmark.name}`}
                  >
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {bookmark.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {bookmark.lat.toFixed(5)}, {bookmark.lng.toFixed(5)}
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleStartEdit(bookmark)}
                    className="text-gray-600 hover:text-blue-600 p-1 flex-shrink-0"
                    title="Edit name"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className="text-gray-600 hover:text-red-600 p-1 flex-shrink-0"
                    title="Remove bookmark"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
