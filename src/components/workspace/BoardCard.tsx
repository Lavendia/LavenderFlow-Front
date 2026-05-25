import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BoardModel } from "@/src/models/BoardModels";

export function BoardCard({
  board,
  onDelete,
  onEdit,
}: {
  board: BoardModel;
  onDelete: (boardId: number) => void;
  onEdit: (board: BoardModel) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setMenuOpen(false);
    onEdit(board);
  };

  return (
    <div
      className="relative flex min-h-[90px] cursor-pointer flex-col justify-between rounded-lg border border-[#5a2c91] bg-[#3d1a6e] p-3 shadow-md transition-all hover:border-[#D896FF] hover:shadow-lg group"
      onClick={() => navigate(`/board?id=${board.id}`)}
    >
      <div className="flex items-start justify-between">
        <h3 className="pr-1 text-sm font-semibold leading-snug text-white">
          {board.name}
        </h3>

        <button
          type="button"
          className="relative z-10 shrink-0 px-1 -mt-0.5 text-[#D896FF] opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          •••
        </button>
      </div>

      {board.description && (
        <p className="mt-1 text-xs text-[#9b6fc7] line-clamp-2">
          {board.description}
        </p>
      )}

      {menuOpen && (
        <div
          className="absolute right-1 top-8 z-50 min-w-36 rounded-lg border border-[#5a2c91] bg-[#2d1052] shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="w-full rounded-t-lg px-4 py-2 text-left text-sm text-white transition-colors hover:bg-[#5a2c91]"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen(false);
              navigate(`/board?id=${board.id}`);
            }}
          >
            Open board
          </button>
          <button
            className="w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-[#5a2c91]"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit();
            }}
          >
            Edit board
          </button>
          <button
            className="w-full rounded-b-lg px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/20"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen(false);
              onDelete(board.id);
            }}
          >
            Delete board
          </button>
        </div>
      )}
    </div>
  );
}
