"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConfirmDialogProps = {
  confirmLabel?: string;
  description: string;
  onConfirm: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export default function ConfirmDialog({ confirmLabel = "Delete", description, onConfirm, onOpenChange, open, title }: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  async function handleConfirm() {
    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsConfirming(false);
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader><DialogFooter><Button disabled={isConfirming} onClick={() => onOpenChange(false)} type="button" variant="outline">Cancel</Button><Button disabled={isConfirming} onClick={() => void handleConfirm()} type="button" variant="destructive">{isConfirming ? "Deleting..." : confirmLabel}</Button></DialogFooter></DialogContent></Dialog>;
}
