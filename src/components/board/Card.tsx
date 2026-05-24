import { useState, useEffect } from "react"
import type { CardModel } from "@/src/models/BoardModels"
import { APIChecklist } from "@/src/api_utils/APIChecklistUtils"
import { CardDetailPopup } from "./CardDetailPopup"

export function Card({ card, onDeleteCard }: { card: CardModel, onDeleteCard: (cardId: number) => void }) {
    const [popupOpen, setPopupOpen] = useState(false)
    const [hasChecklist, setHasChecklist] = useState(false)
    const [currentCard, setCurrentCard] = useState(card)

    useEffect(() => {
        setCurrentCard(card)
        checkForChecklists()
    }, [card])

    const checkForChecklists = async () => {
        try {
            const checklists = await APIChecklist.checklists.getChecklistsByCardId(card.id.toString())
            setHasChecklist(checklists.length > 0)
        } catch (error) {
            console.error("Failed to check checklists:", error)
        }
    }

    const handleUpdateCard = async (updatedCard: CardModel) => {
        setCurrentCard(updatedCard)
    }

    return (
        <>
            <div
                onClick={() => setPopupOpen(true)}
                className="flex justify-between bg-[#5a2c91] border border-[#7a3db8] rounded-lg p-2 shadow-sm overflow-hidden cursor-pointer hover:border-[#D896FF] hover:shadow-md transition-all"
            >
                <h4 className="text-white font-semibold text-sm overflow-hidden w-[90%] ">
                    {currentCard.name}
                </h4>

                <button
                    type="button"
                    className="relative pointer-events-auto text-[#D896FF] hover:text-white -mt-1"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDeleteCard(card.id)
                    }}
                >
                    x
                </button>

                {hasChecklist && (
                    <div className="flex items-center gap-1 text-xs text-[#D896FF]">
                        <span className="inline-block w-1 h-1 bg-[#D896FF] rounded-full"></span>
                        Checklist
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