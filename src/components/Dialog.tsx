"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  className?: string;
  labelledBy?: string;
  label?: string;
  children: ReactNode;
};

/**
 * Thin wrapper over the native <dialog>: showModal() gives focus trapping,
 * Esc-to-close and an inert page for free. The closing animation plays via
 * the [data-closing] attribute before the dialog is actually closed.
 */
export function Dialog({ open, onClose, className, labelledBy, label, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.removeAttribute("data-closing");
      d.showModal();
      document.body.classList.add("lock");
    } else if (!open && d.open) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        d.close();
        document.body.classList.remove("lock");
        return;
      }
      d.setAttribute("data-closing", "");
      const t = window.setTimeout(() => {
        d.close();
        d.removeAttribute("data-closing");
        document.body.classList.remove("lock");
      }, 260);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Unmount safety: never leave the page scroll-locked.
  useEffect(() => () => document.body.classList.remove("lock"), []);

  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={labelledBy}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself, outside its panel)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
