import { useState, useEffect } from "react"
import { APIChecklist } from "@/src/api_utils/APIChecklistUtils"
import { PopupDialog } from "../PopupDialog"
import { signalRService } from "@/src/services/SignalRService"

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
        if (!checklists) return;
        checklists.forEach((checklist) => {
            if (checklist.id > 0 && !checklistItems[checklist.id]) {
                fetchChecklistItems(checklist.id)
            }
        })
    }, [checklists])

    useEffect(() => {
        signalRService.setHandlers({
            onChecklistItemCreated: (item) => {
                setChecklistItems((prev) => {
                    const currentItems = prev[item.checklistId] || [];
                    if (currentItems.some(i => Number(i.id) === Number(item.id) || (i.id < 0 && i.name === item.name))) {
                        return {
                            ...prev,
                            [item.checklistId]: currentItems.map(i => (i.id < 0 && i.name === item.name) ? item : i)
                        };
                    }
                    return {
                        ...prev,
                        [item.checklistId]: [...currentItems, item]
                    };
                })
            },
            onChecklistItemUpdated: (updatedItem) => {
                setChecklistItems((prev) => ({
                    ...prev,
                    [updatedItem.checklistId]: (prev[updatedItem.checklistId] || []).map(item =>
                        Number(item.id) === Number(updatedItem.id) ? updatedItem : item
                    )
                }))
            },
            onChecklistItemDeleted: (itemId: number) => {
                setChecklistItems((prev) => {
                    const updated = { ...prev }
                    for (const checklistId in updated) {
                        updated[checklistId] = updated[checklistId].filter(item => Number(item.id) !== Number(itemId))
                    }
                    return updated
                })
            }
        })
    }, [])

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
        const trimmedName = name.trim()
        if (!trimmedName) return

        const tempId = -Math.floor(Math.random() * 100000)
        const tempChecklist: Checklist = { id: tempId, name: trimmedName, cardId }

        setChecklistItems(prev => ({ ...prev, [tempId]: [] }))
        onChecklistsUpdate([...checklists, tempChecklist])
        setPopupOpen(false)

        try {
            const newChecklist = await APIChecklist.checklists.createChecklist(trimmedName, cardId)

            setChecklistItems(prev => {
                const updated = { ...prev }
                updated[newChecklist.id] = updated[tempId] || []
                delete updated[tempId]
                return updated
            })

            const updatedChecklists = await APIChecklist.checklists.getChecklistsByCardId(cardId.toString())
            onChecklistsUpdate(updatedChecklists)
        } catch (error) {
            console.error("Failed to create checklist:", error)
            onChecklistsUpdate(checklists.filter(c => c.id !== tempId))
        }
    }

    const handleAddChecklistItem = async (name: string) => {
        const trimmedName = name.trim()
        if (!trimmedName || selectedChecklistId === null) return

        const tempId = -Math.floor(Math.random() * 100000)
        const tempItem: ChecklistItem = {
            id: tempId,
            name: trimmedName,
            finished: false,
            checklistId: selectedChecklistId
        }

        setChecklistItems((prev) => ({
            ...prev,
            [selectedChecklistId]: [...(prev[selectedChecklistId] || []), tempItem]
        }))
        setItemPopupOpen(false)

        try {
            const newItem = await APIChecklist.checklistItems.createChecklistItem(trimmedName, selectedChecklistId)

            setChecklistItems((prev) => ({
                ...prev,
                [selectedChecklistId]: (prev[selectedChecklistId] || []).map(item =>
                    (Number(item.id) === tempId || (item.id < 0 && item.name === trimmedName)) ? newItem : item
                )
            }))
        } catch (error) {
            console.error("Failed to create checklist item:", error)
            setChecklistItems((prev) => ({
                ...prev,
                [selectedChecklistId]: (prev[selectedChecklistId] || []).filter(item => item.id !== tempId)
            }))
        }
    }

    const handleToggleItem = async (itemId: number, checklistId: number, finished: boolean) => {
        try {
            setChecklistItems((prev) => ({
                ...prev,
                [checklistId]: prev[checklistId].map((item) =>
                    Number(item.id) === Number(itemId) ? { ...item, finished: !finished } : item
                )
            }))
            await APIChecklist.checklistItems.updateChecklistItem(itemId.toString(), {
                finished: !finished
            })
        } catch (error) {
            console.error("Failed to update checklist item:", error)
            setChecklistItems((prev) => ({
                ...prev,
                [checklistId]: prev[checklistId].map((item) =>
                    Number(item.id) === Number(itemId) ? { ...item, finished: finished } : item
                )
            }))
        }
    }

    const handleDeleteChecklist = async (checklistId: number) => {
        const fallbackChecklists = [...checklists]
        const fallbackItems = { ...checklistItems }

        onChecklistsUpdate(checklists.filter((c) => Number(c.id) !== Number(checklistId)))
        setChecklistItems(prev => {
            const next = { ...prev }
            delete next[checklistId]
            return next
        })

        try {
            await APIChecklist.checklists.deleteChecklist(checklistId.toString())
        } catch (error) {
            console.error("Failed to delete checklist:", error)
            onChecklistsUpdate(fallbackChecklists)
            setChecklistItems(fallbackItems)
        }
    }

    const handleDeleteItem = async (itemId: number, checklistId: number) => {
        // 1. Mise à jour optimiste instantanée de l'UI
        setChecklistItems((prev) => ({
            ...prev,
            [checklistId]: (prev[checklistId] || []).filter((item) => Number(item.id) !== Number(itemId))
        }))

        try {
            // 2. Appel API de suppression
            await APIChecklist.checklistItems.deleteChecklistItem(itemId.toString())
        } catch (error) {
            console.error("Failed to delete checklist item:", error)
            // En cas d'échec réseau, on re-récupère les items propres depuis l'API pour annuler l'effet optimiste
            fetchChecklistItems(checklistId)
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
                                <div className="flex gap-2">
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

                            {(!checklistItems[checklist.id] || checklistItems[checklist.id].length === 0) ? (
                                <p className="text-gray-400 text-xs italic">
                                    No items yet
                                </p>
                            ) : (
                                <div className="space-y-1">
                                    {checklistItems[checklist.id].map((item) => (
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