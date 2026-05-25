import { useEffect, useState } from "react";
import type { WorkspaceMemberModel } from "@/src/models/WorkspaceModels";
import {
  fetchWorkspaceMembers,
  inviteUserToWorkspaceByEmail,
} from "@/src/utils/workspaceAccess";

interface WorkspaceMembersPopupProps {
  isOpen: boolean;
  workspaceId: number | null;
  workspaceName: string;
  canManage: boolean;
  onClose: () => void;
}

export function WorkspaceMembersPopup({
  isOpen,
  workspaceId,
  workspaceName,
  canManage,
  onClose,
}: WorkspaceMembersPopupProps) {
  const [members, setMembers] = useState<WorkspaceMemberModel[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || workspaceId == null) return;

    const loadMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        setMembers(await fetchWorkspaceMembers(workspaceId));
      } catch {
        setError("Could not load members.");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    void loadMembers();
  }, [isOpen, workspaceId]);

  const handleInvite = async () => {
    if (!canManage || workspaceId == null) return;

    setSubmitting(true);
    setError(null);

    try {
      await inviteUserToWorkspaceByEmail(workspaceId, email);
      setEmail("");
      setMembers(await fetchWorkspaceMembers(workspaceId));
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Invite failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || workspaceId == null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-[#5a2c91] bg-[#2d1052] p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white">Members — {workspaceName}</h2>
        <p className="mt-1 text-sm text-[#d8b7ff]">
          Only people listed here can access this workspace.
        </p>

        {loading ? (
          <p className="mt-4 text-sm text-[#EFBBFF]">Loading members...</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {members.length === 0 ? (
              <li className="text-sm text-[#EFBBFF]">No members found.</li>
            ) : (
              members.map((member) => (
                <li
                  key={member.id}
                  className="rounded-lg border border-[#5a2c91] bg-[#3d1a6e] px-3 py-2 text-sm"
                >
                  <p className="font-medium text-white">
                    {member.userName || `User #${member.userId}`}
                  </p>
                  {member.userEmail && (
                    <p className="text-xs text-[#9b6fc7]">{member.userEmail}</p>
                  )}
                  {member.roleName && (
                    <p className="mt-1 text-xs text-[#D896FF]">{member.roleName}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        )}

        {canManage && (
          <div className="mt-4 border-t border-[#5a2c91] pt-4">
            <label className="mb-2 block text-sm text-white">Invite by email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teammate@school.fr"
              className="mb-3 w-full rounded border border-[#5a2c91] bg-[#3d1a6e] px-3 py-2 text-white focus:border-[#D896FF] focus:outline-none"
            />
            <button
              type="button"
              disabled={!email.trim() || submitting}
              onClick={() => void handleInvite()}
              className="w-full rounded bg-[#D896FF] px-4 py-2 text-sm font-bold text-[#2d1052] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Inviting..." : "Invite"}
            </button>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#5a2c91] px-4 py-2 text-sm text-white hover:bg-[#5a2c91]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
