import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BoardModel } from "@/src/models/BoardModels";
import { APIBoard } from "@/src/api_utils/APIBoardUtils";

export function BoardCard({
  board,
  onDelete,
  onRename,
}: {
  board: BoardModel;
  onDelete: (boardId: number) => void;
  onRename: (boardId: number, newName: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftName, setDraftName] = useState(board.name);
  const navigate = useNavigate();

  const commitRename = async () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== board.name) {
      await APIBoard.updateBoard(board.id.toString(), { name: trimmed });
      onRename(board.id, trimmed);
    } else {
      setDraftName(board.name);
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") commitRename();
    if (event.key === "Escape") {
      setDraftName(board.name);
      setIsRenaming(false);
    }
  };

  return (
    <div
      className="relative bg-[#3d1a6e] border border-[#5a2c91] rounded-lg p-3 shadow-md cursor-pointer hover:border-[#D896FF] hover:shadow-lg transition-all group min-h-[90px] flex flex-col justify-between"
      onClick={() => navigate(`/board?id=${board.id}`)}
    >
      <div className="flex justify-between items-start">
        {isRenaming ? (
          <input
            autoFocus
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            onBlur={commitRename}
            onKeyDown={handleKeyDown}
            onClick={(event) => event.stopPropagation()}
            className="flex-1 bg-[#2d1052] text-white font-semibold text-sm rounded px-2 py-0.5 outline outline-1 outline-[#D896FF] focus:outline-[#D896FF] mr-1"
          />
        ) : (
          <h3 className="text-white font-semibold text-sm leading-snug pr-1">
            {board.name}
          </h3>
        )}

        <button
          type="button"
          className="text-[#D896FF] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0 px-1 -mt-0.5 relative z-10"
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          •••
        </button>
      </div>

      {board.description && (
        <p className="text-[#9b6fc7] text-xs mt-1 line-clamp-2">
          {board.description}
        </p>
      )}

      {menuOpen && (
        <div
          className="absolute top-8 right-1 bg-[#2d1052] border border-[#5a2c91] rounded-lg shadow-lg min-w-36 z-50"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#5a2c91] transition-colors rounded-t-lg"
            onClick={() => navigate(`/board?id=${board.id}`)}
          >
            Open board
          </button>
          <button
            className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#5a2c91] transition-colors"
            onClick={() => {
              setIsRenaming(true);
              setMenuOpen(false);
            }}
          >
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-2 text-red-400 text-sm hover:bg-red-500/20 transition-colors rounded-b-lg"
            onClick={() => onDelete(board.id)}
          >
            Delete board
          </button>
        </div>
      )}
    </div>
  );
}
