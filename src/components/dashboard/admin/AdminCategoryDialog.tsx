import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/src/components/shared/ImageUpload";
import type { AdminCategoryDialogProps } from "@/src/types/admin";

export default function AdminCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  isCreating,
  error,
  imageKey,
  onImageChange,
}: AdminCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button />}>Add category</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription>
            Create a reusable equipment category.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input id="category-name" name="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <Input id="category-description" name="description" />
          </div>
          <div className="space-y-2">
            <Label>Category image</Label>
            <ImageUpload key={imageKey} onChange={onImageChange} />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" disabled={isCreating} type="submit">
            {isCreating ? "Creating..." : "Create category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
