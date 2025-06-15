import { useEffect } from "react";
import NoteForm from "../NoteForm/NoteForm";
import css from "./NoteModal.module.css";
import { createPortal } from "react-dom";

interface NoteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NoteModal({ onClose, onSuccess }: NoteModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        {<NoteForm onClose={onClose} onSuccess={onSuccess} />}
      </div>
    </div>,
    document.body
  );
}
