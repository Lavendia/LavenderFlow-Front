import { useEffect, useRef, useState } from "react";

interface BoardCreationPopupProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  confirmLabel?: string;
  initialName?: string;
  initialDescription?: string;
  initialIsPublic?: boolean;
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
  placeholder = "Board name",
  confirmLabel = "Confirm",
  initialName = "",
  initialDescription = "",
  initialIsPublic = false,
  onConfirm,
  onCancel,
}: BoardCreationPopupProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setName(initialName);
    setDescription(initialDescription);
    setIsPublic(initialIsPublic);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [isOpen, initialDescription, initialIsPublic, initialName]);

  const handleConfirm = () => {
    if (!name.trim()) return;

    onConfirm({
      name: name.trim(),
      description: description.trim(),
      isPublic,
    });
  };

  const handleCancel = () => {
    setName(initialName);
    setDescription(initialDescription);
    setIsPublic(initialIsPublic);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg border border-[#5a2c91] bg-[#2d1052] p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="mb-3 w-full rounded border border-[#5a2c91] bg-[#3d1a6e] px-3 py-2 text-white focus:border-[#D896FF] focus:outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mb-3 h-24 w-full resize-none rounded border border-[#5a2c91] bg-[#3d1a6e] px-3 py-2 text-white focus:border-[#D896FF] focus:outline-none"
        />

        <label className="mb-4 flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public board
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded border border-[#5a2c91] px-4 py-2 text-white transition-colors hover:bg-[#5a2c91]/30"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!name.trim()}
            className="rounded bg-[#D896FF] px-4 py-2 font-bold text-[#2d1052] transition-colors hover:bg-[#D896FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
