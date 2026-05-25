import { useState, useRef, useEffect } from "react";

interface BoardCreationPopupProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  onConfirm: (data: {
    name: string;
    description: string;
    isPublic: boolean;
  }) => void;
  onCancel: () => void;
}

export function BoardCreationPopup({
  isOpen,
  title,
  onConfirm,
  onCancel,
}: BoardCreationPopupProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setIsPublic(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!name.trim()) return;

    onConfirm({
      name: name.trim(),
      description: description.trim(),
      isPublic,
    });

    setName("");
    setDescription("");
    setIsPublic(false);
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setIsPublic(false);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2d1052] border border-[#5a2c91] rounded-lg p-6 shadow-lg w-96">

        <h2 className="text-white font-bold text-lg mb-4">
          {title}
        </h2>

        {/* NAME */}
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Board name"
          className="w-full bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white mb-3 focus:outline-none focus:border-[#D896FF]"
        />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full bg-[#3d1a6e] border border-[#5a2c91] rounded px-3 py-2 text-white mb-3 h-24 resize-none focus:outline-none focus:border-[#D896FF]"
        />

        {/* PUBLIC CHECKBOX */}
        <label className="flex items-center gap-2 text-white mb-4 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public board
        </label>

        {/* ACTIONS */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-white border border-[#5a2c91] rounded hover:bg-[#5a2c91]/30 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="px-4 py-2 bg-[#D896FF] text-[#2d1052] font-bold rounded hover:bg-[#D896FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}