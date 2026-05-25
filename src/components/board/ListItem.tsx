import type { ListModel, CardModel } from "@/src/models/BoardModels";
import { Card } from "./Card";
import { useEffect, useRef, useState } from "react";
import { PopupDialog } from "../PopupDialog";
import { APIList } from "@/src/api_utils/APIListUtils";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function List({
    list,
    cards,
    onAddCard,
    onDeleteList,
    onDeleteCard,
}: {
    list: ListModel,
    cards: CardModel[],
    onAddCard: (listId: number, name: string) => void,
    onDeleteList: (listId: number) => void,
    onDeleteCard: (cardId: number) => void,
}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [popupCardOpen, setPopupCardOpen] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [draftName, setDraftName] = useState(list.name)
    const inputRef = useRef<HTMLInputElement>(null)

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: list.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    useEffect(() => {
        setDraftName(list.name)
    }, [list.name])

    const handleAddCardClick = () => {
        setPopupCardOpen(true)
        setMenuOpen(false)
    }

    const commitRename = () => {
        const trimmed = draftName.trim()
        if (trimmed && trimmed !== list.name) {
            APIList.updateList(list.id.toString(), { name: trimmed })
        } else {
            setDraftName(list.name)
        }
        setIsEditingName(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") commitRename()
        if (e.key === "Escape") {
            setDraftName(list.name)
            setIsEditingName(false)
        }
    }

    const handlePopupCardConfirm = (name: string) => {
        onAddCard(list.id, name)
        setPopupCardOpen(false)
    }

    const handleRenameListClick = () => {
        setIsEditingName(true)
        setMenuOpen(false)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[#3d1a6e] border border-[#5a2c91] rounded-lg p-3 shadow-md w-70 shrink-0 flex flex-col max-h-[80vh]"
        >
            <div
                className="flex justify-between items-center mb-3 relative z-10 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/5 transition-colors"
                {...attributes}
                {...listeners}
            >
                {isEditingName ? (
                    <input
                        ref={inputRef}
                        value={draftName}
                        onChange={e => setDraftName(e.target.value)}
                        onBlur={commitRename}
                        onKeyDown={handleKeyDown}
                        onPointerDown={(e) => e.stopPropagation()} // Stop drag initiation on text selection
                        className="flex-1 bg-[#2d1052] text-white font-bold text-sm rounded px-2 py-0.5 outline-1 outline-[#D896FF] focus:outline-[#D896FF] mr-2"
                    />
                ) : (
                    <h3
                        className="text-white font-bold cursor-pointer rounded px-1 hover:bg-white/10 transition-colors"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => setIsEditingName(true)}
                        title="Click to rename"
                    >
                        {draftName}
                    </h3>
                )}

                <button
                    type="button"
                    className="relative z-50 pointer-events-auto text-[#D896FF] hover:text-white px-2"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                    }}
                >
                    ...
                </button>

                {menuOpen && (
                    <div className="absolute top-8 right-0 bg-[#2d1052] border border-[#5a2c91] rounded-lg shadow-lg min-w-37.5 z-50">
                        <button
                            className="w-full text-left px-4 py-2 text-white hover:bg-[#5a2c91] transition-colors"
                            onClick={handleRenameListClick}
                        >
                            Rename list
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-white hover:bg-[#5a2c91] transition-colors"
                            onClick={handleAddCardClick}
                        >
                            Add card
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors"
                            onClick={async () => {
                                onDeleteList(list.id)
                                setMenuOpen(false)
                            }}
                        >
                            Delete list
                        </button>
                    </div>
                )}
            </div>

            <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-1 custom-scrollbar">
                    {cards.toSorted((a, b) => a.order - b.order).map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            onDeleteCard={onDeleteCard}
                        />
                    ))}
                </div>
            </SortableContext>

            <div className="flex flex-col gap-2 bg mt-2 pt-2 border-t border-[#5a2c91]/30">
                <button
                    className="bg-[#5a2c91]/10 border border-[#7a3db8]/70 rounded-lg p-2 shadow-sm cursor-pointer hover:border-[#D896FF] hover:shadow-md text-white/80 hover:text-white text-sm transition-all"
                    onClick={handleAddCardClick}
                >
                    + Add card
                </button>
            </div>

            <PopupDialog
                isOpen={popupCardOpen}
                title="Add new card"
                placeholder="Enter card name..."
                onConfirm={handlePopupCardConfirm}
                onCancel={() => setPopupCardOpen(false)}
            />
        </div>
    )
}