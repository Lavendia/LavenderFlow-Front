import { useState, useEffect } from "react"
import { APIChecklist } from "@/src/api_utils/APIChecklistUtils"
import { PopupDialog } from "../PopupDialog"

interface Checklist {
    id: number
    name: string
    cardId: number
}

interface ChecklistItem {
    id: number
    name: string
    finished: boolean
    checklistId: number
}

interface ChecklistComponentProps {
    cardId: number
    checklists: Checklist[]
    onChecklistsUpdate: (checklists: Checklist[]) => void
}

export function ChecklistComponent({
    cardId,
    checklists,
    onChecklistsUpdate
}: ChecklistComponentProps) {
    const [checklistItems, setChecklistItems] = useState<{ [key: number]: ChecklistItem[] }>({})
    const [popupOpen, setPopupOpen] = useState(false)
    const [itemPopupOpen, setItemPopupOpen] = useState(false)
    const [selectedChecklistId, setSelectedChecklistId] = useState<number | null>(null)

    useEffect(() => {
        checklists.forEach((checklist) => {
            fetchChecklistItems(checklist.id)
        })
    }, [checklists])

    const fetchChecklistItems = async (checklistId: number) => {
        try {
            const data = await APIChecklist.checklistItems.getChecklistItemsByChecklistId(checklistId.toString())
            setChecklistItems((prev) => ({
                ...prev,
                [checklistId]: data
            }))
        } catch (error) {
            console.error("Failed to fetch checklist items:", error)
        }
    }

    const handleAddChecklist = async (name: string) => {
        try {
            const newChecklist = await APIChecklist.checklists.createChecklist(name, cardId)
            const updatedChecklists = [...checklists, newChecklist]
            onChecklistsUpdate(updatedChecklists)
            setChecklistItems((prev) => ({
                ...prev,
                [newChecklist.id]: []
            }))
            setPopupOpen(false)
        } catch (error) {
            console.error("Failed to create checklist:", error)
        }
    }

    const handleAddChecklistItem = async (name: string) => {
        if (selectedChecklistId !== null) {
            try {
                const newItem = await APIChecklist.checklistItems.createChecklistItem(
                    name,
                    selectedChecklistId
                )
                setChecklistItems((prev) => ({
                    ...prev,
                    [selectedChecklistId]: [...(prev[selectedChecklistId] || []), newItem]
                }))
                setItemPopupOpen(false)
            } catch (error) {
                console.error("Failed to create checklist item:", error)
            }
        }
    }

    const handleToggleItem = async (itemId: number, checklistId: number, finished: boolean) => {
        try {
            await APIChecklist.checklistItems.updateChecklistItem(itemId.toString(), {
                finished: !finished
            })
            setChecklistItems((prev) => ({
                ...prev,
                [checklistId]: prev[checklistId].map((item) =>
                    item.id === itemId ? { ...item, finished: !finished } : item
                )
            }))
        } catch (error) {
            console.error("Failed to update checklist item:", error)
        }
    }

    const handleDeleteChecklist = async (checklistId: number) => {
        try {
            await APIChecklist.checklists.deleteChecklist(checklistId.toString())
            const updatedChecklists = checklists.filter((c) => c.id !== checklistId)
            onChecklistsUpdate(updatedChecklists)
            const newItems = { ...checklistItems }
            delete newItems[checklistId]
            setChecklistItems(newItems)
        } catch (error) {
            console.error("Failed to delete checklist:", error)
        }
    }

    const handleDeleteItem = async (itemId: number, checklistId: number) => {
        try {
            await APIChecklist.checklistItems.deleteChecklistItem(itemId.toString())
            setChecklistItems((prev) => ({
                ...prev,
                [checklistId]: prev[checklistId].filter((item) => item.id !== itemId)
            }))
        } catch (error) {
            console.error("Failed to delete checklist item:", error)
        }
    }

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <label className="text-[#D896FF] font-semibold text-sm">
                    Checklists
                </label>
                <button
                    onClick={() => setPopupOpen(true)}
                    className="text-sm text-[#D896FF] border border-[#D896FF] rounded px-2 py-1 hover:bg-[#D896FF]/20 transition-colors"
                >
                    + Add Checklist
                </button>
            </div>

            {checklists.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    No checklists yet. Create one to organize your tasks.
                </p>
            ) : (
                <div className="space-y-3">
                    {checklists.map((checklist) => (
                        <div
                            key={checklist.id}
                            className="bg-[#3d1a6e] border border-[#5a2c91] rounded p-3"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-white font-semibold">
                                    {checklist.name}
                                </p>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => {
                                            setSelectedChecklistId(checklist.id)
                                            setItemPopupOpen(true)
                                        }}
                                        className="text-xs text-[#D896FF] hover:text-white transition-colors"
                                    >
                                        + Add item
                                    </button>
                                    <button
                                        onClick={() => handleDeleteChecklist(checklist.id)}
                                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Checklist Items */}
                            {(checklistItems[checklist.id] || []).length === 0 ? (
                                <p className="text-gray-400 text-xs italic">
                                    No items yet
                                </p>
                            ) : (
                                <div className="space-y-1">
                                    {checklistItems[checklist.id]?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={item.finished}
                                                onChange={() =>
                                                    handleToggleItem(item.id, checklist.id, item.finished)
                                                }
                                                className="w-4 h-4 cursor-pointer accent-[#D896FF]"
                                            />
                                            <span
                                                className={`text-sm flex-1 ${
                                                    item.finished
                                                        ? "text-gray-400 line-through"
                                                        : "text-white"
                                                }`}
                                            >
                                                {item.name}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteItem(item.id, checklist.id)}
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <PopupDialog
                isOpen={popupOpen}
                title="Add new checklist"
                placeholder="Enter checklist name..."
                onConfirm={handleAddChecklist}
                onCancel={() => setPopupOpen(false)}
            />

            <PopupDialog
                isOpen={itemPopupOpen}
                title="Add checklist item"
                placeholder="Enter item name..."
                onConfirm={handleAddChecklistItem}
                onCancel={() => setItemPopupOpen(false)}
            />
        </div>
    )
}
