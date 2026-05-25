import { useEffect, useState } from "react";
import { APIBoard } from "@/src/api_utils/APIBoardUtils";
import { APIWorkspace } from "@/src/api_utils/APIWorkspaceUtils";
import type { BoardModel } from "@/src/models/BoardModels";
import { PopupDialog } from "../PopupDialog";
import { BoardCard } from "./BoardCard";
import { BoardCreationPopup } from "./BoardCreationPopup";

type WorkspaceModel = {
  id: number;
  name: string;
  description?: string | null;
};

type WorkspaceWithBoards = WorkspaceModel & {
  boards: BoardModel[];
};

function BoardCarousel({
  boards,
  onCreateBoard,
  onEditBoard,
  onDeleteBoard,
}: {
  boards: BoardModel[];
  onCreateBoard: () => void;
  onEditBoard: (board: BoardModel) => void;
  onDeleteBoard: (boardId: number) => void;
}) {
  return (
    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
      {boards.map((board) => (
        <div key={board.id} className="min-w-56 shrink-0">
          <BoardCard board={board} onEdit={onEditBoard} onDelete={onDeleteBoard} />
        </div>
      ))}

      <button
        type="button"
        onClick={onCreateBoard}
        className="min-w-56 rounded-2xl border border-dashed border-[#7a3db8]/70 bg-[#5a2c91]/10 p-4 text-left text-[#D896FF] transition-colors hover:border-[#D896FF] hover:bg-[#D896FF]/5"
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="h-3 w-20 rounded-full bg-white/15" />
            <div className="mt-2 h-2 w-12 rounded-full bg-white/10" />
          </div>
          <div>
            <p className="text-sm font-semibold">Create new board</p>
            <p className="mt-1 text-xs text-[#EFBBFF]/70">Add it to this workspace</p>
          </div>
        </div>
      </button>
    </div>
  );
}

export function WorkspaceBackground() {
  const [workspaces, setWorkspaces] = useState<WorkspaceWithBoards[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspacePopupOpen, setWorkspacePopupOpen] = useState(false);
  const [boardPopupOpen, setBoardPopupOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState<number | null>(null);
  const [workspaceRenameOpen, setWorkspaceRenameOpen] = useState(false);
  const [boardEditOpen, setBoardEditOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BoardModel | null>(null);

  const loadWorkspaces = async () => {
    const workspaceData = (await APIWorkspace.getWorkspaces()) as WorkspaceModel[];
    const withBoards = await Promise.all(
      workspaceData.map(async (workspace) => ({
        ...workspace,
        boards: (await APIBoard.getBoardsByWorkspaceId(workspace.id.toString())) as BoardModel[],
      })),
    );
    setWorkspaces(withBoards);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadWorkspaces();
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateWorkspace = async (name: string) => {
    await APIWorkspace.createWorkspace(name, "", false);
    await loadWorkspaces();
  };

  const handleCreateBoard = async (data: {
    name: string;
    description: string;
    isPublic: boolean;
  }) => {
    if (!selectedWorkspaceId) return;

    await APIBoard.createBoard(data.name, data.description, selectedWorkspaceId);
    setBoardPopupOpen(false);
    await loadWorkspaces();
  };

  const handleUpdateBoard = async (data: {
    name: string;
    description: string;
    isPublic: boolean;
  }) => {
    if (!selectedBoard) return;

    await APIBoard.updateBoard(selectedBoard.id.toString(), {
      name: data.name,
      description: data.description,
    });
    setBoardEditOpen(false);
    setSelectedBoard(null);
    await loadWorkspaces();
  };

  const handleDeleteBoard = async (boardId: number) => {
    await APIBoard.deleteBoard(boardId.toString());
    await loadWorkspaces();
  };

  const handleRenameWorkspace = async (name: string) => {
    if (!selectedWorkspaceId) return;

    await APIWorkspace.updateWorkspace(selectedWorkspaceId.toString(), { name });
    await loadWorkspaces();
  };

  const handleDeleteWorkspace = async (workspaceId: number) => {
    await APIWorkspace.deleteWorkspace(workspaceId.toString());
    await loadWorkspaces();
  };

  const openBoardPopup = (workspaceId: number) => {
    setSelectedWorkspaceId(workspaceId);
    setBoardPopupOpen(true);
  };

  const openWorkspaceRename = (workspace: WorkspaceModel) => {
    setSelectedWorkspaceId(workspace.id);
    setWorkspaceRenameOpen(true);
    setWorkspaceMenuOpen(null);
  };

  const openBoardEdit = (board: BoardModel) => {
    setSelectedBoard(board);
    setBoardEditOpen(true);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#1a0a2e] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 lg:px-8">
        <div className="rounded-3xl border border-[#3d1a6e] bg-[#2d1052] p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D896FF]">
                Workspaces
              </p>
              <h1 className="mt-2 font-serif text-3xl text-white md:text-4xl">
                Your workspace list
              </h1>
              <p className="mt-2 text-sm text-[#d8b7ff]">
                Each workspace contains a horizontal carousel of boards.
              </p>
            </div>

            <button
              onClick={() => setWorkspacePopupOpen(true)}
              className="rounded-lg border border-[#D896FF] px-4 py-2 text-sm text-[#D896FF] transition-colors hover:bg-[#D896FF]/10"
            >
              + New workspace
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-3xl border border-[#3d1a6e] bg-[#2d1052]"
                />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#7a3db8]/70 bg-[#2d1052] p-8 text-center">
              <p className="text-sm text-[#EFBBFF]">No workspaces yet. Create your first one.</p>
            </div>
          ) : (
            workspaces.map((workspace) => (
              <section
                key={workspace.id}
                className="rounded-3xl border border-[#3d1a6e] bg-[#2d1052] p-5 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    
                    <h2 className="mt-2 text-xl font-semibold text-white">{workspace.name}</h2>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setWorkspaceMenuOpen(
                          workspaceMenuOpen === workspace.id ? null : workspace.id,
                        )
                      }
                      className="rounded-lg border border-[#3d1a6e] bg-[#1f0f3a] px-3 py-2 text-sm text-[#EFBBFF] transition-colors hover:border-[#D896FF]"
                    >
                      •••
                    </button>

                    {workspaceMenuOpen === workspace.id && (
                      <div className="absolute right-0 top-11 z-50 min-w-40 overflow-hidden rounded-xl border border-[#5a2c91] bg-[#2d1052] shadow-lg">
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-[#5a2c91]"
                          onClick={() => openWorkspaceRename(workspace)}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-500/20"
                          onClick={() => handleDeleteWorkspace(workspace.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="rounded-lg border border-[#3d1a6e] bg-[#1f0f3a] px-3 py-2 text-sm text-[#EFBBFF]">
                    {workspace.boards.length} board{workspace.boards.length === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openBoardPopup(workspace.id)}
                    className="rounded-lg border border-[#D896FF] px-3 py-2 text-sm text-[#D896FF] transition-colors hover:bg-[#D896FF]/10"
                  >
                    + Add board
                  </button>
                </div>

                {workspace.boards.length > 0 ? (
                  <BoardCarousel
                    boards={workspace.boards}
                    onCreateBoard={() => openBoardPopup(workspace.id)}
                    onEditBoard={openBoardEdit}
                    onDeleteBoard={handleDeleteBoard}
                  />
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-[#7a3db8]/70 bg-[#1f0f3a] p-5 text-sm text-[#EFBBFF]">
                    No boards in this workspace.
                    <div className="mt-4">
                      <button
                        onClick={() => openBoardPopup(workspace.id)}
                        className="rounded-lg border border-[#D896FF] px-4 py-2 text-sm text-[#D896FF] transition-colors hover:bg-[#D896FF]/10"
                      >
                        + Create board
                      </button>
                    </div>
                  </div>
                )}
              </section>
            ))
          )}
        </div>
      </div>

      <PopupDialog
        isOpen={workspacePopupOpen}
        title="Create new workspace"
        placeholder="Enter workspace name..."
        onConfirm={handleCreateWorkspace}
        onCancel={() => setWorkspacePopupOpen(false)}
      />

      <PopupDialog
        isOpen={workspaceRenameOpen}
        title="Rename workspace"
        placeholder="Enter workspace name..."
        onConfirm={handleRenameWorkspace}
        onCancel={() => setWorkspaceRenameOpen(false)}
      />

      <BoardCreationPopup
        isOpen={boardPopupOpen}
        title="Create new board"
        placeholder="Enter board name..."
        onConfirm={handleCreateBoard}
        onCancel={() => setBoardPopupOpen(false)}
      />

      <BoardCreationPopup
        isOpen={boardEditOpen}
        title="Edit board"
        confirmLabel="Save"
        placeholder="Board name"
        initialName={selectedBoard?.name ?? ""}
        initialDescription={selectedBoard?.description ?? ""}
        onConfirm={handleUpdateBoard}
        onCancel={() => {
          setBoardEditOpen(false);
          setSelectedBoard(null);
        }}
      />
    </section>
  );
}
