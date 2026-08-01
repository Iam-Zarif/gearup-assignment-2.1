"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageUpload from "@/src/components/shared/ImageUpload";

export default function CreateEquipmentForm() {
  function handleImage(file: File | null) {
    console.log(file);
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Equipment Details</CardTitle>

        <CardDescription>
          Fill all information before publishing your equipment.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label>Category</Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="tractor">Tractor</SelectItem>

                <SelectItem value="harvester">Harvester</SelectItem>

                <SelectItem value="tools">Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Equipment Name</Label>

              <Input placeholder="Trekking Pole Set" />
            </div>

            <div className="space-y-2">
              <Label>Brand</Label>

              <Input placeholder="TrailMaster" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              rows={5}
              placeholder="Lightweight adjustable trekking poles..."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Price Per Day</Label>

              <Input type="number" placeholder="180" />
            </div>

            <div className="space-y-2">
              <Label>Stock Quantity</Label>

              <Input type="number" placeholder="8" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Quantity</Label>

            <Input type="number" placeholder="8" />
          </div>

          <div className="space-y-2">
            <Label>Equipment Image</Label>

            <ImageUpload onChange={handleImage} />
          </div>

          <div className="rounded-xl border p-5 space-y-4">
            <h3 className="font-semibold">Specifications</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Material</Label>

                <Input placeholder="Aluminum" />
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>

                <Input placeholder="Good" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adjustable Length</Label>

              <Input placeholder="65cm-135cm" />
            </div>
          </div>

          <Button className="w-full">Create Equipment</Button>
        </form>
      </CardContent>
    </Card>
  );
}
