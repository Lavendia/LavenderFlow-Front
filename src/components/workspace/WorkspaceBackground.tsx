import { useEffect, useState } from "react";
import { APIBoard } from "@/src/api_utils/APIBoardUtils";
import { APIWorkspace } from "@/src/api_utils/APIWorkspaceUtils";
import type { BoardModel } from "@/src/models/BoardModels";
import { PopupDialog } from "../PopupDialog";
import { BoardCard } from "./BoardCard";

export function WorkspaceBackground() {
  const [boards, setBoards] = useState<BoardModel[]>([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  const workspaceId = window.location.search.split("id=")[1];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const workspace = await APIWorkspace.getWorkspaceById(workspaceId);
      setWorkspaceName(workspace.name);

      const data = await APIBoard.getBoardsByWorkspaceId(workspaceId);
      setBoards(data);
    } catch (error) {
      console.error("Failed to fetch workspace data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoard = async (name: string) => {
    const tempId = -Math.floor(Math.random() * 1000000);
    const tempBoard: BoardModel = { id: tempId, name, description: "" };

    setBoards((prev) => [...prev, tempBoard]);
    setPopupOpen(false);

    try {
      await APIBoard.createBoard(name, "", Number(workspaceId));
      const data = await APIBoard.getBoardsByWorkspaceId(workspaceId);
      setBoards(data);
    } catch {
      setBoards((prev) => prev.filter((b) => b.id !== tempId));
    }
  };

  const handleDeleteBoard = async (boardId: number) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));

    try {
      await APIBoard.deleteBoard(boardId.toString());
    } catch (error) {
      console.error("Failed to delete board:", error);
      const data = await APIBoard.getBoardsByWorkspaceId(workspaceId);
      setBoards(data);
    }
  };

  const handleRenameBoard = (boardId: number, newName: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, name: newName } : b)),
    );
  };

  return (
    <section className="min-h-screen relative">
      {/* Workspace Title */}
      <div className="absolute top-25 md:top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="text-center text-white font-serif text-3xl rounded-lg border border-[#3d1a6e] hover:border-[#D896FF] transition-colors bg-transparent px-3">
          {workspaceName}
        </div>
      </div>

      {/* Main Panel */}
      <div
        className="
                absolute
                w-[97%] h-[90%]
                top-[58%] md:top-1/2
                left-1/2
                -translate-x-1/2 translate-y-[-48%]
                bg-[#2d1052]
                border border-[#3d1a6e]
                rounded-lg px-6 py-5 shadow-lg
            "
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <p className="text-[#9b6fc7] text-sm">
            {boards.length} {boards.length === 1 ? "board" : "boards"}
          </p>
          <button
            onClick={() => setPopupOpen(true)}
            className="text-sm text-[#D896FF] border border-[#D896FF] rounded px-3 py-1.5 hover:bg-[#D896FF]/20 transition-colors"
          >
            + New board
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-[#9b6fc7] text-sm">Loading boards...</p>
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-[#9b6fc7] text-sm">
              No boards yet. Create one to get started.
            </p>
            <button
              onClick={() => setPopupOpen(true)}
              className="text-sm text-[#D896FF] border border-[#D896FF] rounded px-4 py-2 hover:bg-[#D896FF]/20 transition-colors"
            >
              + Create your first board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={handleDeleteBoard}
                onRename={handleRenameBoard}
              />
            ))}
            <button
              onClick={() => setPopupOpen(true)}
              className="bg-[#5a2c91]/10 border border-dashed border-[#7a3db8]/70 rounded-lg p-3 min-h-[90px] flex items-center justify-center text-[#D896FF] text-sm hover:border-[#D896FF] hover:bg-[#D896FF]/5 transition-all cursor-pointer"
            >
              + New board
            </button>
          </div>
        )}
      </div>

      {/* Create Board Dialog */}
      <PopupDialog
        isOpen={popupOpen}
        title="Create new board"
        placeholder="Enter board name..."
        onConfirm={handleAddBoard}
        onCancel={() => setPopupOpen(false)}
      />
    </section>
  );
}
