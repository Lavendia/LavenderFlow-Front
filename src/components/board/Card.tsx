import { useState, useEffect } from "react"
import type { CardModel, UserModel } from "@/src/models/BoardModels"
import { APIChecklist } from "@/src/api_utils/APIChecklistUtils"
import { APIRelation } from "@/src/api_utils/APIRelationUtils"
import { CardDetailPopup } from "./CardDetailPopup"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { CheckSquare, Clock, ListTodo } from "lucide-react"
import { signalRService } from "@/src/services/SignalRService"

export function Card({ card, onDeleteCard }: { card: CardModel, onDeleteCard: (cardId: number) => void }) {
    const [popupOpen, setPopupOpen] = useState(false)
    const [checklistCount, setChecklistCount] = useState(0)
    const [assignedUsers, setAssignedUsers] = useState<UserModel[]>([])
    const [currentCard, setCurrentCard] = useState(card)
    const [labelColor, setLabelColor] = useState<string>("")

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    useEffect(() => {
        setCurrentCard(card)
        const fetchMetadata = async () => {
            try {
                const checklists = await APIChecklist.checklists.getChecklistsByCardId(card.id.toString())
                setChecklistCount(checklists?.length || 0)
                fetchAssignedUsers(card.id)
                fetchLabelColor(card.id)
            } catch (error) {
                console.error("Failed to load card metadata:", error)
            }
        }
        fetchMetadata()
    }, [card.id, card])

    useEffect(() => {
        const subscriberId = `card-${card.id}`
        const fetchMetadata = async () => {
            try {
                const checklists = await APIChecklist.checklists.getChecklistsByCardId(card.id.toString())
                setChecklistCount(checklists?.length || 0)
                fetchAssignedUsers(card.id)
                fetchLabelColor(card.id)
            } catch (error) {
                console.error("Failed to reload card metadata:", error)
            }
        }
        signalRService.subscribe(subscriberId, {
            onCardUpdated: (updatedCard) => {
                if (updatedCard.id === card.id) {
                    setCurrentCard(updatedCard)
                }
            },
            onCardDeleted: (deletedCardId) => {
                if (deletedCardId === card.id) {
                    onDeleteCard(card.id)
                }
            },
            onChecklistCreated: () => fetchMetadata(),
            onChecklistUpdated: () => fetchMetadata(),
            onChecklistDeleted: () => fetchMetadata(),
            onAssignmentCreated: () => fetchMetadata(),
            onAssignmentDeleted: () => fetchMetadata(),
            onLabelAddedToCard: () => fetchLabelColor(card.id),
            onLabelRemovedFromCard: () => fetchLabelColor(card.id),
        })
        return () => signalRService.unsubscribe(subscriberId)
    }, [card.id])

    const fetchAssignedUsers = async (cardId: number) => {
        try {
            const boardId = window.location.search.split("id=")[1]

            const [assignments, boardUsers] = await Promise.all([
                APIRelation.cards.getCardAssignees(cardId.toString()),
                APIRelation.boards.getBoardUsers(boardId)
            ])

            const assignedIds = assignments.map((a:any) => a.userId || a.id)

            const mappedUsers = boardUsers
                .map((u:any) => ({
                    id: u.userId || u.id,
                    name: u.userName || u.name,
                    email: u.userEmail || u.email
                }))
                .filter((u:UserModel) => assignedIds.includes(u.id))

            setAssignedUsers(mappedUsers)

        } catch (error) {
            console.error("Failed to fetch assigned users:", error)
        }
    }

    const fetchLabelColor = async (cardId: number) => {
        try {
            const cardLabels = await APIRelation.labels.getLabelsByCardId(cardId.toString())
            if (cardLabels && cardLabels.length > 0) {
                setLabelColor(cardLabels[0].colorHex)
            } else {
                setLabelColor("")
            }
        } catch (error) {
            console.error("Failed to fetch label color:", error)
        }
    }

    const handleUpdateCard = async (updatedCard: CardModel) => {
        setCurrentCard(updatedCard)
        try {
            const checklists = await APIChecklist.checklists.getChecklistsByCardId(updatedCard.id.toString())
            setChecklistCount(checklists?.length || 0)
            fetchAssignedUsers(card.id)
            fetchLabelColor(card.id) // ← add this line
        } catch (error) {
            console.error("Failed to reload card metadata:", error)
        }
    }

    const renderCardDeadlineBadge = () => {
        if (!currentCard.deadline) return null

        const dateObj = new Date(currentCard.deadline)
        const isComplete = dateObj.getFullYear() === 9999

        if (isComplete) {
            return (
                <div className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 font-medium">
                    <CheckSquare className="h-3 w-3" />
                    <span>Done</span>
                </div>
            )
        }

        const formattedDate = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        const now = Date.now()
        const targetTime = dateObj.getTime()

        let badgeStyles = "bg-[#3d1a6e] text-gray-300 border border-[#5a2c91]"
        if (now > targetTime) {
            badgeStyles = "bg-red-500/20 text-red-400 border border-red-500/30"
        } else if (targetTime - now < 24 * 60 * 60 * 1000) {
            badgeStyles = "bg-amber-500/20 text-amber-400 border border-amber-500/30"
        }

        return (
            <div className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded font-medium ${badgeStyles}`}>
                <Clock className="h-3 w-3" />
                <span>{formattedDate}</span>
            </div>
        )
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={() => setPopupOpen(true)}
                className="relative flex flex-col gap-2.5 bg-[#5a2c91] border border-[#7a3db8] rounded-lg p-3 shadow-sm cursor-pointer hover:border-[#D896FF] hover:shadow-md transition-all text-left w-full overflow-hidden"
            >
                <div className="flex justify-between items-start w-full gap-2">
                    <h4 className="text-white font-semibold text-sm wrap-break-word flex-1 leading-tight">
                        {currentCard.name}
                    </h4>

                    <button
                        type="button"
                        className="relative pointer-events-auto text-[#D896FF] hover:text-white text-sm px-1 font-sans transition-colors"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation()
                            onDeleteCard(card.id)
                        }}
                    >
                        ✕
                    </button>
                </div>

                {(checklistCount > 0 || currentCard.deadline || assignedUsers.length > 0 || labelColor) && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 select-none w-full">

                        {labelColor && (
                            <div
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{
                                    backgroundColor: `${labelColor}`,
                                    boxShadow: `0 0 6px ${labelColor}99`
                                }}
                                title="Label"
                            />
                        )}

                        {renderCardDeadlineBadge()}

                        {checklistCount > 0 && (
                            <div className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-[#3d1a6e] border border-[#5a2c91] text-[#D896FF] font-medium">
                                <ListTodo className="h-3 w-3 text-[#D896FF]" />
                                <span>{checklistCount}</span>
                            </div>
                        )}

                        {assignedUsers.length > 0 && (
                            <div className="flex items-center ml-auto">
                                {assignedUsers.slice(0, 4).map((user, index) => (
                                    <div
                                        key={user.id}
                                        title={user.name}
                                        className="w-6 h-6 rounded-full bg-[#D896FF] text-[#2d1052] text-[10px] font-bold flex items-center justify-center border-2 border-[#5a2c91] -ml-1 first:ml-0"
                                        style={{ zIndex: assignedUsers.length - index }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                ))}

                                {assignedUsers.length > 4 && (
                                    <div className="w-6 h-6 rounded-full bg-[#3d1a6e] text-white text-[10px] flex items-center justify-center border-2 border-[#5a2c91] -ml-1">
                                        +{assignedUsers.length - 4}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CardDetailPopup
                isOpen={popupOpen}
                card={currentCard}
                onClose={() => setPopupOpen(false)}
                onUpdate={handleUpdateCard}
            />
        </>
    )
}