import type { ReactNode } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DetailsDialogProps = {
  children: ReactNode;
  description: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export default function DetailsDialog({ children, description, onOpenChange, open, title }: DetailsDialogProps) {
  return <Dialog onOpenChange={onOpenChange} open={open}><DialogContent className="max-h-[85vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-4xl"><DialogHeader className="pr-10"><DialogTitle className="text-lg">{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>{children}</DialogContent></Dialog>;
}
