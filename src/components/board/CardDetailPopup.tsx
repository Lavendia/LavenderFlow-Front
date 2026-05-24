import { useState, useEffect, useRef } from "react"
import type { CardModel } from "@/src/models/BoardModels"
import { APICard } from "@/src/api_utils/APICardUtils"
import { APIChecklist } from "@/src/api_utils/APIChecklistUtils"
import { APIRelation } from "@/src/api_utils/APIRelationUtils"
import { ChecklistComponent } from "./ChecklistComponent"
import ReactMarkdown from "react-markdown";

interface Checklist {
    id: number
    name: string
    cardId: number
}

interface User {
    id: number
    name: string
    email: string
}

interface CardDetailPopupProps {
    isOpen: boolean
    card: CardModel | null
    onClose: () => void
    onUpdate: (card: CardModel) => void
}

export function CardDetailPopup({
    isOpen,
    card,
    onClose,
    onUpdate
}: CardDetailPopupProps) {
    const [description, setDescription] = useState("")
    const [editingDescription, setEditingDescription] = useState(false)
    const [checklists, setChecklists] = useState<Checklist[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [assignedUsers, setAssignedUsers] = useState<number[]>([])
    const [isEditingName, setIsEditingName] = useState(false)
    const [draftName, setDraftName] = useState(card!.name)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && card) {
            setDescription(card.description || "")
            fetchChecklists(card.id)
            fetchUsers()
            setAssignedUsers([])
        }
    }, [isOpen, card])

    const commitRename = () => {
        const trimmed = draftName.trim()
        if (trimmed && trimmed !== card!.name) {
            APICard.updateCard(card!.id.toString(), { name: trimmed })
            card!.name = trimmed
        } else {
            setDraftName(card!.name)
        }
        setIsEditingName(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") commitRename()
        if (e.key === "Escape") {
            setDraftName(card!.name)
            setIsEditingName(false)
        }
    }

    const fetchChecklists = async (cardId: number) => {
        try {
            const data = await APIChecklist.checklists.getChecklistsByCardId(cardId.toString())
            setChecklists(data)
        } catch (error) {
            console.error("Failed to fetch checklists:", error)
        }
    }

    const fetchUsers = async () => {
        try {
            const data = await APIRelation.boards.getBoardUsers(window.location.search.split('id=')[1])
            setUsers(data)
        } catch (error) {
            console.error("Failed to fetch users:", error)
        }
    }

    const handleSaveDescription = async () => {
        if (card) {
            try {
                await APICard.updateCard(card.id.toString(), { description })
                const updatedCard = { ...card, description }
                onUpdate(updatedCard)
            } catch (error) {
                console.error("Failed to update description:", error)
            }
        }
    }

    const handleAssignUser = async (userId: number) => {
        if (assignedUsers.includes(userId)) {
            APIRelation.cards.removeAssigneeFromCard(card!.id.toString(), userId.toString()).catch(error => {
                console.error("Failed to unassign user:", error)
            })
            setAssignedUsers(assignedUsers.filter(id => id !== userId))
        } else {
            APIRelation.cards.addAssigneeToCard(card!.id, userId).catch(error => {
                console.error("Failed to assign user:", error)
            })
            setAssignedUsers([...assignedUsers, userId])
        }
    }

    if (!isOpen || !card) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-[#2d1052] border border-[#5a2c91] rounded-lg p-6 shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                {isEditingName ? (
                    <input
                        ref={inputRef}
                        value={draftName}
                        onChange={e => setDraftName(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-[#2d1052] text-white font-bold text-sm rounded px-2 py-0.5 outline outline-1 outline-[#D896FF] focus:outline-[#D896FF] mr-2"
                    />
                ) : (
                    <h2
                        className="text-white font-bold cursor-pointer rounded px-1 hover:bg-white/10 transition-colors"
                        onClick={() => setIsEditingName(true)}
                        title="Click to rename"
                    >
                        {card.name}
                    </h2>
                )}

                <div className="mb-6">
                    <label className="text-[#D896FF] font-semibold text-sm block mb-2">
                        Description
                    </label>
                    {description && !editingDescription && (
                        <>
                            <div className="bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white prose prose-invert max-w-none overflow-y-auto">
                                <ReactMarkdown>
                                    {description}
                                </ReactMarkdown>
                            </div>
                            <button
                            onClick={() => setEditingDescription(true)}
                            className="mt-2 px-3 py-1 text-sm bg-[#D896FF] text-[#2d1052] font-semibold rounded hover:bg-[#D896FF]/90 transition-colors"
                            >
                                Edit Description
                            </button>
                        </>
                    )}

                    {editingDescription && (
                        <>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a description..."
                                className="w-full bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#D896FF] focus:ring-1 focus:ring-[#D896FF] transition-colors h-24 resize-none"
                            />
                            <button
                            onClick={() => {handleSaveDescription(); setEditingDescription(false)}}
                            className="mt-2 px-3 py-1 text-sm bg-[#D896FF] text-[#2d1052] font-semibold rounded hover:bg-[#D896FF]/90 transition-colors"
                            >
                                Save Description
                            </button>
                        </>
                    )}
                </div>

                <div className="mb-6">
                    <label className="text-[#D896FF] font-semibold text-sm block mb-2">
                        Assign Users
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {users.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleAssignUser(user.id)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    assignedUsers.includes(user.id)
                                        ? "bg-[#D896FF] text-[#2d1052] font-semibold"
                                        : "bg-[#3d1a6e] border border-[#5a2c91] text-white hover:border-[#D896FF]"
                                }`}
                            >
                                {user.name}
                            </button>
                        ))}
                    </div>
                </div>

                <ChecklistComponent
                    cardId={card.id}
                    checklists={checklists}
                    onChecklistsUpdate={setChecklists}
                />

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#D896FF] text-[#2d1052] font-bold rounded hover:bg-[#D896FF]/90 transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    )
}
