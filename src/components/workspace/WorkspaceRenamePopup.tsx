import { useEffect, useRef, useState } from "react";

interface WorkspaceRenamePopupProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  confirmLabel?: string;
  initialValue?: string;
  onConfirm: (value: string) => void | Promise<void>;
  onCancel: () => void;
}

export function WorkspaceRenamePopup({
  isOpen,
  title,
  placeholder = "Workspace name",
  confirmLabel = "Save",
  initialValue = "",
  onConfirm,
  onCancel,
}: WorkspaceRenamePopupProps) {
  const [value, setValue] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setValue(initialValue);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [isOpen, initialValue]);

  const handleConfirm = async () => {
    const trimmed = value.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onConfirm(trimmed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    onCancel();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleConfirm();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg border border-[#5a2c91] bg-[#2d1052] p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="mb-4 w-full rounded border border-[#5a2c91] bg-[#3d1a6e] px-3 py-2 text-white placeholder-gray-400 transition-colors focus:border-[#D896FF] focus:outline-none focus:ring-1 focus:ring-[#D896FF]"
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="rounded border border-[#5a2c91] px-4 py-2 text-white transition-colors hover:bg-[#5a2c91]/30 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!value.trim() || submitting}
            className="rounded bg-[#D896FF] px-4 py-2 font-bold text-[#2d1052] transition-colors hover:bg-[#D896FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
