import { useState, useEffect, useRef } from "react"
import { APICard } from "@/src/api_utils/APICardUtils"
import { APIChecklist } from "@/src/api_utils/APIChecklistUtils"
import { APIRelation } from "@/src/api_utils/APIRelationUtils"
import { ChecklistComponent } from "./ChecklistComponent"
import ReactMarkdown from "react-markdown"
import { signalRService } from "@/src/services/SignalRService"
import type { CardModel, UserModel } from "@/src/models/BoardModels"
import { Calendar, Trash2, CheckSquare, Square, Users, SendHorizontal } from "lucide-react"
import { APIChatMessage } from "@/src/api_utils/APIChatMessageUtils"
import { APIUser } from "@/src/api_utils/APIUserUtils"

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

interface ChatMessage {
    id: number
    text: string
    userId: number
    cardid: number
    userName: string
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
    const [draftName, setDraftName] = useState(card?.name || "")
    const inputRef = useRef<HTMLInputElement>(null)
    const [user, setUser] = useState<UserModel>()

    const [dueDate, setDueDate] = useState<string>("")
    const [isDeadlineComplete, setIsDeadlineComplete] = useState<boolean>(false)

    const [chatMessage, setChatMessage] = useState<string>("")
    const [allChatMessages, setAllChatMessages] = useState<ChatMessage[]>()

    useEffect(() => {
        if (!isOpen || !card) return

        setDraftName(card.name)
        setDescription(card.description || "")
        fetchChecklists(card.id)
        fetchUsersAndPermissions()
        fetchAssignedUsers(card.id)
        fetchChatMessages(card.id)

        if (card.deadline) {
            const dateObj = new Date(card.deadline)
            if (dateObj.getFullYear() === 9999) {
                setIsDeadlineComplete(true)
                setDueDate("")
            } else {
                const year = dateObj.getFullYear()
                const month = String(dateObj.getMonth() + 1).padStart(2, '0')
                const day = String(dateObj.getDate()).padStart(2, '0')
                setDueDate(`${year}-${month}-${day}`)
                setIsDeadlineComplete(false)
            }
        } else {
            setDueDate("")
            setIsDeadlineComplete(false)
        }
    }, [isOpen, card?.id])

    useEffect(() => {
        if (!isOpen || !card) return

        const currentCardId = card.id

        signalRService.setHandlers({
            onCardUpdated: (updatedCard: CardModel) => {
            if (updatedCard.id === currentCardId) {
                onUpdate(updatedCard)

                setDescription(updatedCard.description || "")
                setDraftName(updatedCard.name || "")

                if (updatedCard.deadline) {
                    const dateObj = new Date(updatedCard.deadline)
                    if (dateObj.getFullYear() === 9999) {
                        setIsDeadlineComplete(true)
                        setDueDate("")
                    } else {
                        setDueDate(dateObj.toISOString().split('T')[0])
                        setIsDeadlineComplete(false)
                    }
                } else {
                    setDueDate("")
                    setIsDeadlineComplete(false)
                }
            }
        },
            onChecklistCreated: (checklist) => {
                if (checklist.cardId === currentCardId) {
                    setChecklists(prev => {
                        if (prev.some(c => c.id === checklist.id || c.name === checklist.name)) return prev
                        return [...prev, checklist]
                    })
                }
            },
            onChecklistUpdated: (updatedChecklist) => {
                setChecklists(prev =>
                    prev.map(c => c.id === updatedChecklist.id ? updatedChecklist : c)
                )
            },
            onChecklistDeleted: (checklistId: number) => {
                setChecklists(prev => prev.filter(c => c.id !== checklistId))
            },
            onAssignmentCreated: (assignment) => {
                if (assignment.cardId === currentCardId) {
                    setAssignedUsers(prev => prev.includes(assignment.userId) ? prev : [...prev, assignment.userId])
                }
            },
            onAssignmentDeleted: (_assignmentId: number) => {
                fetchAssignedUsers(currentCardId)
            },
            onChatMessageCreated: () => {
                fetchChatMessages(card.id)
            }
        })
    }, [isOpen, card?.id, card])

    useEffect(() => {
        APIUser.getMe().then(user => setUser(user))
    }, [])

    const commitRename = async () => {
        const trimmed = draftName.trim()
        if (trimmed && trimmed !== card!.name) {
            await APICard.updateCard(card!.id.toString(), { name: trimmed })
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

    const fetchChatMessages = async (cardId: number) => {
        try {
            const data: ChatMessage[] =
                await APIChatMessage.getChatMessagesByCardId(cardId.toString())

            const messagesWithUsers = await Promise.all(
                data.map(async (d) => ({
                    ...d, userName: (await APIUser.getUserById(d.userId.toString())).name
                }))
            )
            setAllChatMessages(messagesWithUsers)

        } catch (error) {
            console.error("Failed to fetch chat messages:", error)
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

    const fetchUsersAndPermissions = async () => {
        try {
            const boardId = window.location.search.split('id=')[1]
            const rawMembers = await APIRelation.boards.getBoardUsers(boardId)
            const formattedUsers = rawMembers.map((m: any) => ({
                id: m.userId || m.id,
                name: m.userName || m.name,
                email: m.userEmail || m.email
            }))
            setUsers(formattedUsers)
        } catch (error) {
            console.error("Failed to fetch users:", error)
        }
    }

    const fetchAssignedUsers = async (cardId: number) => {
        try {
            const assignments = await APIRelation.cards.getCardAssignees(cardId.toString())
            setAssignedUsers(assignments.map((a: any) => a.userId || a.id))
        } catch (error) {
            console.error("Failed to fetch assigned users:", error)
        }
    }

    const handleSaveDescription = async () => {
        if (card) {
            try {
                await APICard.updateCard(card.id.toString(), { description })
                onUpdate({ ...card, description })
            } catch (error) {
                console.error("Failed to update description:", error)
            }
        }
    }

    const handleAssignUser = async (userId: number) => {
        try {
            if (assignedUsers.includes(userId)) {
                await APIRelation.cards.removeAssigneeFromCard(card!.id.toString(), userId.toString())
                setAssignedUsers(prev => prev.filter(id => id !== userId))
            } else {
                await APIRelation.cards.addAssigneeToCard(card!.id, userId)
                setAssignedUsers(prev => [...prev, userId])
            }
            if (card) {
                const refreshed = await APICard.getCardById(card.id.toString())
                onUpdate(refreshed)
            }
        } catch (error) {
            console.error("Failed to update assignment:", error)
        }
    }

    const handleSaveDeadline = async (date: string, completed: boolean) => {
        if (!card) return;

        let deadline: string | null;

        if (completed) {
            deadline = new Date(9999,11,31,23,59,59).toISOString();
        }
        else if (date) {
            const [year, month, day] = date.split("-").map(Number);
            deadline = new Date(year, month - 1, day, 23, 59, 0).toISOString();
        }
        else {
            deadline = null;
        }

        setDueDate(date);
        setIsDeadlineComplete(completed);

        onUpdate({...card, deadline});

        try {
            await APICard.updateCard(card.id.toString(), { deadline });
        } catch (error) {
            console.error("Failed to save deadline:", error);
        }
    };

    const handleRemoveDeadline = async () => {
        if (!card) return;

        try {
            await APICard.updateCard(card.id.toString(), {deadline: null});
            setIsDeadlineComplete(false);
            setDueDate("");
            onUpdate({...card, deadline: null});
        } catch (error) {
            console.error(error);
        }
    };

    const getDeadlineStatusBadge = () => {
        if (isDeadlineComplete) {
            return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">Completed</span>
        }
        if (!dueDate) return null

        const [year, month, day] = dueDate.split("-").map(Number)
        const targetDateTime = new Date(year, month - 1, day, 23, 59).getTime()
        const now = Date.now()

        if (now > targetDateTime) {
            return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">Overdue</span>
        }
        if (targetDateTime - now < 24 * 60 * 60 * 1000) {
            return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Due Soon</span>
        }
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#5a2c91]/40 text-[#D896FF] border border-[#5a2c91]">On Track</span>
    }

    const handleClose = async () => {
        if (card) {
            try {
                const updatedCard = await APICard.getCardById(card.id.toString())
                onUpdate(updatedCard)
            } catch (error) {
                console.error("Failed to refetch card:", error)
            }
        }
        onClose()
    }

    const handleSaveChatMessage = async () => {
        if (chatMessage === "") return
        try{
            await APIChatMessage.createChatMessage(chatMessage, card!.id, user!.id)
            setChatMessage("")
        } catch (err) {
            console.error(err)
        }
    }

    if (!isOpen || !card) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2d1052] border border-[#5a2c91] rounded-lg p-6 shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar text-left">
                <div className="mb-4">
                    {isEditingName ? (
                        <input
                            ref={inputRef}
                            value={draftName}
                            onChange={e => setDraftName(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-[#3d1a6e] text-white font-bold text-xl rounded px-2 py-1 outline-none border border-[#D896FF]"
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="text-white font-bold text-xl rounded px-1 cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => setIsEditingName(true)}
                        >
                            {card.name}
                        </h2>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#1f0a3a] border border-[#5a2c91]/40 rounded-lg p-4">
                        <div className="flex items-center gap-1.5 mb-3 text-[#D896FF]">
                            <Users className="h-4 w-4" />
                            <label className="font-bold text-sm uppercase tracking-wider">Card Members</label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {users.map((user) => {
                                const isAssigned = assignedUsers.includes(user.id)
                                return (
                                    <button
                                        key={user.id}
                                        onClick={() => handleAssignUser(user.id)}
                                        className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                                            isAssigned
                                                ? "bg-[#D896FF] text-[#2d1052] hover:bg-red-200 hover:text-red-900"
                                                : "bg-[#3d1a6e] border border-[#5a2c91] text-white hover:border-[#D896FF]"
                                        }`}
                                    >
                                        {isAssigned ? `✓ ${user.name}` : `+ ${user.name}`}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-[#1f0a3a] border border-[#5a2c91]/40 rounded-lg p-4 flex flex-col justify-between min-h-27.5">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[#D896FF] font-bold text-sm uppercase tracking-wider">
                                    Deadline (at 23:59)
                                </label>
                                {getDeadlineStatusBadge()}
                            </div>

                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="date"
                                    value={dueDate}
                                    disabled={isDeadlineComplete}
                                    onChange={(e) => {
                                        setDueDate(e.target.value)
                                        if (e.target.value) handleSaveDeadline(e.target.value, false)
                                    }}
                                    className="w-full bg-[#3d1a6e] border border-[#5a2c91] text-white rounded-md pl-9 pr-2 py-1.5 text-xs outline-none focus:border-[#D896FF] disabled:opacity-40"
                                />
                            </div>
                        </div>

                        {(dueDate || isDeadlineComplete) && (
                            <div className="flex items-center justify-between border-t border-[#5a2c91]/30 pt-2.5 mt-2">
                                <button
                                    onClick={() => {
                                        const nextComplete = !isDeadlineComplete
                                        setIsDeadlineComplete(nextComplete)
                                        handleSaveDeadline(dueDate, nextComplete)
                                    }}
                                    className="flex items-center gap-2 text-xs text-white hover:text-[#D896FF] transition-colors"
                                >
                                    {isDeadlineComplete ? (
                                        <CheckSquare className="h-4 w-4 text-[#D896FF]" />
                                    ) : (
                                        <Square className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span>Mark as completed</span>
                                </button>

                                <button
                                    onClick={handleRemoveDeadline}
                                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-[#D896FF] font-semibold text-sm block mb-2">Description</label>
                    {!editingDescription ? (
                        <>
                            <div className="bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white prose prose-invert max-w-none min-h-12">
                                <ReactMarkdown>{description || "*No description provided.*"}</ReactMarkdown>
                            </div>
                            <button
                                onClick={() => setEditingDescription(true)}
                                className="mt-2 px-3 py-1 text-xs bg-[#3d1a6e] border border-[#5a2c91] text-white rounded hover:border-[#D896FF] transition-colors"
                            >
                                Edit Description
                            </button>
                        </>
                    ) : (
                        <>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white focus:outline-none focus:border-[#D896FF] h-24 resize-none text-sm"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => { handleSaveDescription(); setEditingDescription(false) }}
                                    className="px-3 py-1 text-xs bg-[#D896FF] text-[#2d1052] font-semibold rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => { setDescription(card?.description || ""); setEditingDescription(false) }}
                                    className="px-3 py-1 text-xs bg-transparent text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <ChecklistComponent
                    cardId={card.id}
                    checklists={checklists}
                    onChecklistsUpdate={setChecklists}
                />

                <div className="mt-2 bg-[#1f0a3a] border border-[#5a2c91]/40 rounded-lg p-4 h-100 overflow-y-scroll w-full">
                    {allChatMessages?.map((message) => {
                        const isMe = message.userId === user!.id
                        return (
                            <div
                                key={message.id}
                                className={`flex w-full ${
                                    isMe ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`flex items-end gap-2 max-w-[75%] ${
                                        isMe ? "flex-row-reverse" : ""
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#D896FF] text-[#2d1052] font-bold flex items-center justify-center shrink-0">
                                        {message.userName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div
                                        className={`flex flex-col ${
                                            isMe ? "items-end" : "items-start"
                                        }`}
                                    >
                                        <span className="text-xs text-[#D896FF] mb-1">
                                            {message.userName}
                                        </span>
                                        <div
                                            className={`px-4 py-2 rounded-2xl break-words shadow-sm ${
                                                isMe
                                                    ? "bg-[#D896FF] text-[#2d1052] rounded-br-sm"
                                                    : "bg-[#3d1a6e] text-white rounded-bl-sm"
                                            }`}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex gap-4 mt-2 bg-[#1f0a3a] border border-[#5a2c91]/40 rounded-lg p-4 h-15 w-full overflow-hidden">
                    <div
                        key={user!.id}
                        title={user!.name}
                        className="w-9 h-8 rounded-full bg-[#D896FF] text-[#2d1052] text-md font-bold flex items-center justify-center border-2 border-[#5a2c91] -ml-1 first:ml-0"
                    >
                        {user!.name.charAt(0).toUpperCase()}
                    </div>
                    <input
                            ref={inputRef}
                            value={chatMessage}
                            placeholder="Send a message..."
                            onChange={(e) => {setChatMessage(e.target.value)}}
                            className="w-full bg-[#3d1a6e] text-white font-bold text-md rounded px-2 py-1 outline-none border border-[#D896FF]"
                            autoFocus
                        />
                    <button
                        type="button"
                        disabled={chatMessage===""}
                        onClick={handleSaveChatMessage}
                    >
                        <SendHorizontal className="text-white hover:text-purple-500"/>
                    </button>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-[#5a2c91]/30">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2 bg-[#D896FF] text-[#2d1052] font-bold rounded-md hover:bg-[#D896FF]/90 transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}