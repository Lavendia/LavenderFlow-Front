import { APIBoard } from "@/src/api_utils/APIBoardUtils"
import { APICard } from "@/src/api_utils/APICardUtils"
import { APIList } from "@/src/api_utils/APIListUtils"
import type { BoardModel, CardModel, ListModel } from "@/src/models/BoardModels"
import { useEffect, useRef, useState } from "react"
import { List } from "./ListItem"
import { PopupDialog } from "../PopupDialog"
import { Settings } from "lucide-react"
import { BoardSettingsPopup } from "./BoardSettingsPopup"
import { signalRService } from "@/src/services/SignalRService"
import {
    DndContext,
    closestCorners,
    type DragEndEvent,
    type DragOverEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core"
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";

export function BoardBackground() {
    const [ board, setBoard ] = useState<BoardModel | null>(null)
    const [ lists, setLists ] = useState<ListModel[]>([])
    const [ cards, setCards ] = useState<CardModel[]>([])
    const [ popupOpen, setPopupOpen ] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [draftName, setDraftName] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const boardId = window.location.search.split("id=")[1]

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    )

    useEffect(() => {
        const fetchData = async () => {
            try {
                const boardResponse = await APIBoard.getBoardById(boardId)

                setBoard({
                    id: boardResponse.id,
                    name: boardResponse.name,
                    description: boardResponse.description
                })
                setDraftName(boardResponse.name)

                const listsResponse = await APIList.getListsByBoardId(boardId)
                setLists(listsResponse)

                const cardsResponses = await Promise.all(
                    listsResponse.map((list: ListModel) => APICard.getCardsByListId(list.id.toString()))
                )
                setCards(cardsResponses.flat())
            } catch (error) {
                console.error("Failed to load data:", error)
                window.location.replace("/dashboard")
                return
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (board === null) return

        signalRService.connect(board.id.toString())

        signalRService.subscribe(board.id.toString(), {
            onBoardUpdated: (updatedBoard) => {
                setBoard(updatedBoard)
                setDraftName(updatedBoard.name)
            },
            onBoardDeleted: () => {
                window.location.href = "/dashboard"
            },
            onListCreated: (list: ListModel) => {
                setLists(prev => [...prev, list])
            },
            onListUpdated: (updatedList: ListModel) => {
                setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l))
            },
            onListDeleted: (listId: number) => {
                setLists(prev => prev.filter(l => l.id !== listId))
                setCards(prev => prev.filter(c => c.listItemId !== listId))
            },
            onCardCreated: (card: CardModel) => {
                setCards(prev => [...prev, card])
            },
            onCardUpdated: (updatedCard: CardModel) => {
                setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c))
            },
            onCardDeleted: (cardId: number) => {
                setCards(prev => prev.filter(c => c.id !== cardId))
            },
        })

        return () => signalRService.unsubscribe(board.id.toString())
    }, [board?.id])

    useEffect(() => {
        if (board?.name) setDraftName(board.name)
    }, [board?.name])

    const commitRename = () => {
        const trimmed = draftName.trim()
        if (!board) return
        if (trimmed && trimmed !== board.name) {
            APIBoard.updateBoard(String(board.id), { name: trimmed })
            setBoard(prev => prev ? { ...prev, name: trimmed } : prev)
        } else {
            setDraftName(board.name)
        }
        setIsEditingName(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") commitRename()
        if (e.key === "Escape") {
            setDraftName(board!.name)
            setIsEditingName(false)
        }
    }

    const handleAddCard = async (listId: number, name: string) => {
        const tempId = -Math.floor(Math.random() * 1000000)
        const tempCard: CardModel = {
            id: tempId,
            name,
            order: cards.filter(c => c.listItemId === listId).length,
            listItemId: listId,
            archived: false,
            description: "",
        }
        setCards(prev => [...prev, tempCard])
        try {
            await APICard.createCard(name, cards.filter(c => c.listItemId === listId).length, listId, "")
            const cardsResponses = await Promise.all(
                lists.map((list: ListModel) => APICard.getCardsByListId(list.id.toString()))
            )
            setCards(cardsResponses.flat())
        } catch {
            setCards(prev => prev.filter(card => card.id !== tempId))
        }
    }

    const handleAddList = async (name: string) => {
        const tempId = -Math.floor(Math.random() * 1000000)
        const tempList: ListModel = { id: tempId, name, order: lists.length }
        setLists(prev => [...prev, tempList])
        try {
            await APIList.createList(name, lists.length, board!.id)
            const listsResponse = await APIList.getListsByBoardId(board!.id.toString())
            setLists(listsResponse)
        } catch {
            setLists(prev => prev.filter(list => list.id !== tempId))
        }
    }

    const handleDeleteList = async (listId: number) => {
        await APIList.deleteList(listId.toString())
        setLists(prev => prev.filter(l => l.id !== listId))
    }

    const handleDeleteCard = async (cardId: number) => {
        await APICard.deleteCard(cardId.toString())
        setCards(prev => prev.filter(c => c.id !== cardId))
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const isListDrag = lists.some(l => l.id === active.id)
        if (isListDrag) return

        const activeCard = cards.find(c => c.id === active.id)
        if (!activeCard) return

        const isOverAList = lists.some(l => l.id === over.id)
        const targetListId = isOverAList ? (over.id as number) : cards.find(c => c.id === over.id)?.listItemId

        if (!targetListId || targetListId === activeCard.listItemId) return

        setCards(prev => {
            const rest = prev.filter(c => c.id !== active.id)
            const targetCards = rest.filter(c => c.listItemId === targetListId).sort((a, b) => a.order - b.order)

            const overIndex = targetCards.findIndex(c => c.id === over.id)
            let newIndex = targetCards.length
            if (overIndex !== -1) newIndex = overIndex

            const updatedCard = { ...activeCard, listItemId: targetListId }
            targetCards.splice(newIndex, 0, updatedCard)

            // Re-normalize orders for targets, components, and sources
            const reorderedTarget = targetCards.map((c, i) => ({ ...c, order: i }))
            const reorderedSource = rest.filter(c => c.listItemId === activeCard.listItemId)
                                         .sort((a, b) => a.order - b.order)
                                         .map((c, i) => ({ ...c, order: i }))

            const remaining = rest.filter(c => c.listItemId !== activeCard.listItemId && c.listItemId !== targetListId)
            return [...remaining, ...reorderedSource, ...reorderedTarget]
        })
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const isListDrag = lists.some(l => l.id === active.id)

        if (isListDrag) {
            if (active.id === over.id) return
            const oldIndex = lists.findIndex(l => l.id === active.id)
            const newIndex = lists.findIndex(l => l.id === over.id)

            const reordered = arrayMove(lists, oldIndex, newIndex).map((list, index) => ({ ...list, order: index }))
            setLists(reordered)

            try {
                await Promise.all(reordered.map(list => APIList.updateList(list.id.toString(), { order: list.order })))
            } catch (err) {
                console.error("Failed to save list order:", err)
            }
        } else {
            const droppedCard = cards.find(c => c.id === active.id)
            if (!droppedCard) return

            const currentContainerId = droppedCard.listItemId
            const containerCards = cards.filter(c => c.listItemId === currentContainerId).sort((a, b) => a.order - b.order)

            const oldIndex = containerCards.findIndex(c => c.id === active.id)
            const newIndex = containerCards.findIndex(c => c.id === over.id)

            let finalCards = cards
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reordered = arrayMove(containerCards, oldIndex, newIndex).map((c, i) => ({ ...c, order: i }))
                finalCards = cards.map(c => reordered.find(rc => rc.id === c.id) || c)
                setCards(finalCards)
            }

            try {
                const targetListState = finalCards.filter(c => c.listItemId === currentContainerId)
                await Promise.all(
                    targetListState.map(card => 
                        APICard.updateCard(card.id.toString(), { order: card.order, listItemId: card.listItemId })
                    )
                )
            } catch (err) {
                console.error("Failed to save card layout updates:", err)
            }
        }
    }

    return (
        <section className="min-h-screen relative">
            <div className="absolute top-20 left-1/2 w-[97%] -translate-x-1/2 z-10 flex items-center gap-3">
                <div className="flex-1 flex items-center justify-center bg-[#2d1052] border border-[#3d1a6e] hover:border-[#D896FF] transition-colors rounded-lg">
                    {isEditingName ? (
                        <input
                            ref={inputRef}
                            value={draftName}
                            onChange={e => setDraftName(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={handleKeyDown}
                            className="flex-1 text-3xl bg-[#2d1052] text-white font-serif text-center rounded outline-1 outline-[#D896FF] focus:outline-[#D896FF] pl-5"
                        />
                    ) : (
                        <span
                            className="text-white font-serif cursor-pointer text-3xl rounded px-1 hover:bg-white/10 transition-colors"
                            onClick={() => setIsEditingName(true)}
                            title="Click to rename"
                        >
                            {draftName}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-center bg-[#2d1052] border border-[#3d1a6e] hover:border-[#D896FF] transition-colors rounded-lg p-2 aspect-square">
                    <button onClick={() => setSettingsOpen(true)}>
                        <Settings className="text-white" />
                    </button>
                </div>
            </div>

            <div className="absolute w-[97%] h-[85%] top-1/2 left-1/2 -translate-x-1/2 translate-y-[-43%] bg-[#2d1052] border border-[#3d1a6e] rounded-lg px-3 py-4 shadow-lg">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners} // Optimized for multi-container configurations
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
                        <div className="flex gap-4 h-full overflow-x-auto items-start pb-4">
                            {lists.toSorted((a,b) => a.order - b.order).map(list => (
                                <List
                                    key={list.id}
                                    list={list}
                                    cards={cards.filter(c => c.listItemId === list.id)}
                                    onAddCard={handleAddCard}
                                    onDeleteList={handleDeleteList}
                                    onDeleteCard={handleDeleteCard}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <button
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-[#D896FF] border border-[#D896FF] rounded px-3 py-1 cursor-pointer hover:bg-[#D896FF]/20 transition-colors"
                    onClick={() => setPopupOpen(true)}
                >
                    + Add new list
                </button>
            </div>

            <PopupDialog
                isOpen={popupOpen}
                title="Add new list"
                placeholder="Enter list name..."
                onConfirm={(name) => {handleAddList(name); setPopupOpen(false)}}
                onCancel={() => setPopupOpen(false)}
            />

            {board && (
                <BoardSettingsPopup
                    isOpen={settingsOpen}
                    board={board}
                    onClose={() => setSettingsOpen(false)}
                    onBoardDeleted={() => window.location.href = "/dashboard"}
                    onBoardUpdated={(updated) => {
                        setBoard(updated)
                        setDraftName(updated.name)
                    }}
                />
            )}
        </section>
    )
}