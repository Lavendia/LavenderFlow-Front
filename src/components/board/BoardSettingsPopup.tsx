import { useState, useEffect } from "react"
import { X, Settings, Users, Trash2, UserMinus, UserPlus } from "lucide-react"
import { APIBoard } from "@/src/api_utils/APIBoardUtils"
import { APIRelation } from "@/src/api_utils/APIRelationUtils"
import { APIUser } from "@/src/api_utils/APIUserUtils"
import { APIRole } from "@/src/api_utils/APIRoleUtils"
import type { BoardMember, BoardSettingsPopupProps } from "@/src/models/BoardModels"
import { signalRService } from "@/src/services/SignalRService"

type Tab = "settings" | "members" | "danger"

export function BoardSettingsPopup({
    isOpen,
    board,
    onClose,
    onBoardDeleted,
    onBoardUpdated
}: BoardSettingsPopupProps) {
    const [activeTab, setActiveTab] = useState<Tab>("settings")

    const [draftName, setDraftName] = useState(board.name)
    const [draftDescription, setDraftDescription] = useState(board.description || "")
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const [members, setMembers] = useState<BoardMember[]>([])
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([])
    const [loadingMembers, setLoadingMembers] = useState(false)

    const [deleteConfirm, setDeleteConfirm] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)

    const [addEmail, setAddEmail] = useState("")
    const [isAdding, setIsAdding] = useState(false)
    const [addError, setAddError] = useState("")
    const [addSuccess, setAddSuccess] = useState(false)

    const [currentUserId, setCurrentUserId] = useState<number | null>(null)

    const currentUserRole = members.find(m => m.userId === currentUserId)?.roleName
    const isAdmin = currentUserRole === "Admin"

    const boardId = window.location.search.split("id=")[1]

    useEffect(() => {
        if (isOpen) {
            setDraftName(board.name)
            setDraftDescription(board.description || "")
            setActiveTab("settings")
            setDeleteConfirm("")
        }
    }, [isOpen, board])

    useEffect(() => {
        if (isOpen && activeTab === "members") {
            fetchMembers()
            APIUser.getMe().then(me => setCurrentUserId(me.id))
        }
    }, [isOpen, activeTab])

    useEffect(() => {
        if (!isOpen) return

        signalRService.setHandlers({
            onUserAddedToBoard: (newMember: BoardMember) => {
                setMembers(prev =>
                    prev.some(m => m.userId === newMember.userId)
                        ? prev
                        : [...prev, newMember]
                )
            },
            onBoardUserUpdated: (updatedMember: BoardMember) => {
                setMembers(prev =>
                    prev.map(m => m.userId === updatedMember.userId ? updatedMember : m)
                )
            },
            onUserRemovedFromBoard: (userId: number) => {
                setMembers(prev => prev.filter(m => m.userId !== userId))
            },
        })

        return () => {
            signalRService.setHandlers({
                onUserAddedToBoard: undefined,
                onBoardUserUpdated: undefined,
                onUserRemovedFromBoard: undefined,
            })
        }
    }, [isOpen])

    const fetchMembers = async () => {
        setLoadingMembers(true)
        try {
            const [membersData, rolesData] = await Promise.all([
                APIRelation.boards.getBoardUsers(boardId),
                APIRole.board.getBoardRoles()
            ])
            setMembers(membersData)
            setRoles(rolesData)
        } catch (error) {
            console.error("Failed to fetch members:", error)
        } finally {
            setLoadingMembers(false)
        }
    }

    const handleAddUser = async () => {
        const email = addEmail.trim()
        if (!email) return
        setIsAdding(true)
        setAddError("")
        setAddSuccess(false)
        try {
            const user = await APIUser.getUserIdByEmail(email)
            await APIRelation.boards.addUserToBoard(boardId, user.id, 3)
            setAddSuccess(true)
            setAddEmail("")
            await fetchMembers()
            setTimeout(() => setAddSuccess(false), 2000)
        } catch {
            setAddError("User not found or already a member.")
        } finally {
            setIsAdding(false)
        }
    }

    const handleRoleChange = async (userId: number, roleId: number) => {
        try {
            await APIRelation.boards.updateUserBoardRole(boardId, userId.toString(), roleId)
            setMembers(prev =>
                prev.map(m =>
                    m.userId === userId
                        ? { ...m, roleName: roles.find(r => r.id === roleId)?.name ?? m.roleName }
                        : m
                )
            )
        } catch (error) {
            console.error("Failed to update role:", error)
        }
    }

    const handleSaveSettings = async () => {
        const trimmedName = draftName.trim()
        if (!trimmedName) return
        setIsSaving(true)
        try {
            await APIBoard.updateBoard(board.id.toString(), {
                name: trimmedName,
                description: draftDescription.trim()
            })
            onBoardUpdated({ ...board, name: trimmedName, description: draftDescription.trim() })
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 2000)
        } catch (error) {
            console.error("Failed to update board:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleRemoveMember = async (userId: number) => {
        try {
            await APIRelation.boards.removeUserFromBoard(boardId, userId.toString())
            setMembers(prev => prev.filter(m => m.userId !== userId))
        } catch (error) {
            console.error("Failed to remove member:", error)
        }
    }

    const handleDeleteBoard = async () => {
        if (deleteConfirm !== board.name) return
        setIsDeleting(true)
        try {
            await APIBoard.deleteBoard(board.id.toString())
            onBoardDeleted()
        } catch (error) {
            console.error("Failed to delete board:", error)
            setIsDeleting(false)
        }
    }

    if (!isOpen) return null

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "settings", label: "Settings", icon: <Settings size={15} /> },
        { id: "members", label: "Members", icon: <Users size={15} /> },
        { id: "danger", label: "Danger zone", icon: <Trash2 size={15} /> },
    ]

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-[#1e0a3c] border border-[#3d1a6e] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#3d1a6e]">
                    <div>
                        <h2 className="text-white font-bold text-lg font-serif">Board settings</h2>
                        <p className="text-[#9b6dbf] text-xs mt-0.5">{board.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#9b6dbf] hover:text-white hover:bg-[#3d1a6e] rounded-lg p-1.5 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex border-b border-[#3d1a6e]">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors flex-1 justify-center
                                ${activeTab === tab.id
                                    ? tab.id === "danger"
                                        ? "text-red-400 border-b-2 border-red-400"
                                        : "text-[#D896FF] border-b-2 border-[#D896FF]"
                                    : "text-[#9b6dbf] hover:text-white"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5 min-h-75">

                    {activeTab === "settings" && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-[#D896FF] text-xs font-semibold uppercase tracking-wider block mb-1.5">
                                    Board name
                                </label>
                                <input
                                    value={draftName}
                                    onChange={e => setDraftName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSaveSettings()}
                                    className="w-full bg-[#2d1052] border border-[#3d1a6e] focus:border-[#D896FF] rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
                                    placeholder="Board name..."
                                />
                            </div>
                            <div>
                                <label className="text-[#D896FF] text-xs font-semibold uppercase tracking-wider block mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={draftDescription}
                                    onChange={e => setDraftDescription(e.target.value)}
                                    className="w-full bg-[#2d1052] border border-[#3d1a6e] focus:border-[#D896FF] rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors resize-none h-24 placeholder-[#6b4a8a]"
                                    placeholder="Add a description..."
                                />
                            </div>
                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving || !draftName.trim()}
                                className="self-end flex items-center gap-2 px-4 py-2 bg-[#D896FF] text-[#1e0a3c] font-bold text-sm rounded-lg hover:bg-[#D896FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? "Saving..." : saveSuccess ? "✓ Saved" : "Save changes"}
                            </button>
                        </div>
                    )}

                    {activeTab === "members" && (
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-[#D896FF] text-xs font-semibold uppercase tracking-wider block mb-1.5">
                                    Add member by email
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        value={addEmail}
                                        onChange={e => { setAddEmail(e.target.value); setAddError("") }}
                                        onKeyDown={e => e.key === "Enter" && handleAddUser()}
                                        placeholder="user@example.com"
                                        type="email"
                                        className="flex-1 bg-[#2d1052] border border-[#3d1a6e] focus:border-[#D896FF] rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors placeholder-[#6b4a8a]"
                                    />
                                    <button
                                        onClick={handleAddUser}
                                        disabled={!addEmail.trim() || isAdding}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-[#D896FF] text-[#1e0a3c] font-bold text-sm rounded-lg hover:bg-[#D896FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                                    >
                                        <UserPlus size={14} />
                                        {isAdding ? "Adding..." : "Add"}
                                    </button>
                                </div>
                                {addError && <p className="text-red-400 text-xs mt-1">{addError}</p>}
                                {addSuccess && <p className="text-green-400 text-xs mt-1">✓ Member added</p>}
                            </div>

                            <div className="border-t border-[#3d1a6e] pt-3">
                                <p className="text-[#9b6dbf] text-xs mb-2">
                                    {members.length} member{members.length !== 1 ? "s" : ""}
                                </p>

                                {loadingMembers ? (
                                    <div className="flex items-center justify-center py-8 text-[#9b6dbf] text-sm">
                                        Loading members...
                                    </div>
                                ) : members.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                                        <Users size={32} className="text-[#3d1a6e]" />
                                        <p className="text-[#9b6dbf] text-sm">No members yet</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                                        {members.map((member) => {
                                            const isMe = member.userId === currentUserId
                                            return (
                                                <div
                                                    key={member.userId}
                                                    className="flex items-center gap-3 bg-[#2d1052] border border-[#3d1a6e] rounded-lg px-3 py-2.5 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-[#5a2c91] flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                        {member.userName.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="flex-1 min-w-0 flex items-center gap-2">
                                                        <p className="text-white text-sm font-medium truncate">{member.userName}</p>
                                                        {isMe && (
                                                            <span className="text-[10px] text-[#D896FF] bg-[#D896FF]/10 border border-[#D896FF]/30 rounded px-1.5 py-0.5 shrink-0">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>

                                                    {!isMe && isAdmin ? (
                                                        <select
                                                            value={roles.find(r => r.name === member.roleName)?.id ?? ""}
                                                            onChange={e => handleRoleChange(member.userId, Number(e.target.value))}
                                                            className="bg-[#3d1a6e] border border-[#5a2c91] text-white text-xs rounded px-2 py-1 outline-none focus:border-[#D896FF] transition-colors cursor-pointer"
                                                        >
                                                            {roles.map(role => (
                                                                <option key={role.id} value={role.id}>
                                                                    {role.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="text-[#9b6dbf] text-xs px-2 shrink-0">{member.roleName}</span>
                                                    )}

                                                    {!isMe && isAdmin && (
                                                        <button
                                                            onClick={() => handleRemoveMember(member.userId)}
                                                            className="text-[#9b6dbf] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded shrink-0"
                                                            title="Remove member"
                                                        >
                                                            <UserMinus size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "danger" && (
                        <div className="flex flex-col gap-5">
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Trash2 size={18} className="text-red-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-red-400 font-semibold text-sm">Delete this board</p>
                                        <p className="text-red-400/70 text-xs mt-1 leading-relaxed">
                                            This will permanently delete <span className="font-bold text-red-400">"{board.name}"</span> including all lists and cards. This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[#9b6dbf] text-xs block mb-1.5">
                                    Type <span className="text-red-400 font-bold">{board.name}</span> to confirm
                                </label>
                                <input
                                    value={deleteConfirm}
                                    onChange={e => setDeleteConfirm(e.target.value)}
                                    className="w-full bg-[#2d1052] border border-red-500/30 focus:border-red-500 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors placeholder-[#6b4a8a]"
                                    placeholder={board.name}
                                />
                            </div>
                            <button
                                onClick={handleDeleteBoard}
                                disabled={deleteConfirm !== board.name || isDeleting}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/40 font-bold text-sm rounded-lg hover:bg-red-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <Trash2 size={15} />
                                {isDeleting ? "Deleting..." : "Delete board permanently"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}