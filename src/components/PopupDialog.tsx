import { useState, useRef, useEffect } from "react"

interface PopupDialogProps {
    isOpen: boolean
    title: string
    placeholder?: string
    onConfirm: (value: string) => void
    onCancel: () => void
}

export function PopupDialog({
    isOpen,
    title,
    placeholder = "Enter value...",
    onConfirm,
    onCancel
}: PopupDialogProps) {
    const [value, setValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setValue("")
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }, [isOpen])

    const handleConfirm = () => {
        if (value.trim()) {
            onConfirm(value.trim())
            setValue("")
        }
    }

    const handleCancel = () => {
        setValue("")
        onCancel()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleConfirm()
        } else if (e.key === "Escape") {
            handleCancel()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#2d1052] border border-[#5a2c91] rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-white font-bold text-lg mb-4">
                    {title}
                </h2>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#D896FF] focus:ring-1 focus:ring-[#D896FF] transition-colors mb-4"
                />

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-white border border-[#5a2c91] rounded hover:bg-[#5a2c91]/30 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!value.trim()}
                        className="px-4 py-2 bg-[#D896FF] text-[#2d1052] font-bold rounded hover:bg-[#D896FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}