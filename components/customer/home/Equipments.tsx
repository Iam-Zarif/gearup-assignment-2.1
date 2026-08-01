"use client";

import { useState } from "react";

import GearCard, {
  Gear,
} from "@/src/components/shared/GearCard";
import { Button } from "@/components/ui/button";

const equipments: Gear[] = [
  {
    id: "1",
    name: "John Deere Tractor",
    brand: "John Deere",
    description:
      "Heavy duty tractor suitable for ploughing, cultivation and transportation work.",
    pricePerDay: 5000,
    stockQuantity: 5,
    availableQuantity: 3,
    imageUrl: "/gear/tractor.jpg",
    category: {
      name: "Tractor",
    },
  },

  {
    id: "2",
    name: "Honda Power Tiller",
    brand: "Honda",
    description:
      "Compact power tiller for soil preparation and small farm cultivation.",
    pricePerDay: 3000,
    stockQuantity: 8,
    availableQuantity: 6,
    imageUrl: "/gear/power-tiller.jpg",
    category: {
      name: "Cultivation",
    },
  },

  {
    id: "3",
    name: "Kubota Combine Harvester",
    brand: "Kubota",
    description:
      "Advanced harvesting machine for rice and crop collection.",
    pricePerDay: 9000,
    stockQuantity: 3,
    availableQuantity: 1,
    imageUrl: "/gear/harvester.jpg",
    category: {
      name: "Harvesting",
    },
  },

  {
    id: "4",
    name: "Walton Irrigation Pump",
    brand: "Walton",
    description:
      "Powerful irrigation pump for agricultural water supply.",
    pricePerDay: 1500,
    stockQuantity: 12,
    availableQuantity: 10,
    imageUrl: "/gear/pump.jpg",
    category: {
      name: "Irrigation",
    },
  },

  {
    id: "5",
    name: "Rotavator Machine",
    brand: "Mahindra",
    description:
      "Rotary tiller machine for preparing soil before planting.",
    pricePerDay: 4000,
    stockQuantity: 6,
    availableQuantity: 4,
    imageUrl: "/gear/rotavator.jpg",
    category: {
      name: "Cultivation",
    },
  },

  {
    id: "6",
    name: "Automatic Seed Drill",
    brand: "VST",
    description:
      "Seed planting equipment for accurate crop sowing.",
    pricePerDay: 3500,
    stockQuantity: 4,
    availableQuantity: 3,
    imageUrl: "/gear/seed-drill.jpg",
    category: {
      name: "Planting",
    },
  },

  {
    id: "7",
    name: "Mini Tractor",
    brand: "Sonalika",
    description:
      "Small tractor for farming and transportation activities.",
    pricePerDay: 4500,
    stockQuantity: 5,
    availableQuantity: 2,
    imageUrl: "/gear/mini-tractor.jpg",
    category: {
      name: "Tractor",
    },
  },

  {
    id: "8",
    name: "Power Sprayer Machine",
    brand: "Honda",
    description:
      "Sprayer machine for fertilizer and pesticide application.",
    pricePerDay: 1200,
    stockQuantity: 15,
    availableQuantity: 12,
    imageUrl: "/gear/sprayer.jpg",
    category: {
      name: "Spraying",
    },
  },

  {
    id: "9",
    name: "Rice Cutter Machine",
    brand: "ACI",
    description:
      "Rice cutting machine for efficient harvesting operations.",
    pricePerDay: 2500,
    stockQuantity: 7,
    availableQuantity: 5,
    imageUrl: "/gear/rice-cutter.jpg",
    category: {
      name: "Harvesting",
    },
  },

  {
    id: "10",
    name: "Disc Plough",
    brand: "Fieldking",
    description:
      "Heavy agricultural plough for deep soil preparation.",
    pricePerDay: 2800,
    stockQuantity: 5,
    availableQuantity: 4,
    imageUrl: "/gear/disc-plough.jpg",
    category: {
      name: "Cultivation",
    },
  },

  {
    id: "11",
    name: "Water Pump Set",
    brand: "Runner",
    description:
      "Diesel water pump for farmland irrigation.",
    pricePerDay: 1800,
    stockQuantity: 10,
    availableQuantity: 8,
    imageUrl: "/gear/water-pump.jpg",
    category: {
      name: "Irrigation",
    },
  },

  {
    id: "12",
    name: "Agriculture Tool Kit",
    brand: "Kisan",
    description:
      "Complete farming hand tools package.",
    pricePerDay: 900,
    stockQuantity: 20,
    availableQuantity: 18,
    imageUrl: "/gear/tool-kit.jpg",
    category: {
      name: "Tools",
    },
  },

  {
    id: "13",
    name: "Rice Transplanter",
    brand: "Kubota",
    description:
      "Machine for automatic rice planting.",
    pricePerDay: 5500,
    stockQuantity: 3,
    availableQuantity: 2,
    imageUrl: "/gear/transplanter.jpg",
    category: {
      name: "Planting",
    },
  },

  {
    id: "14",
    name: "Thresher Machine",
    brand: "ACI",
    description:
      "Machine for separating grains from crops.",
    pricePerDay: 3500,
    stockQuantity: 5,
    availableQuantity: 3,
    imageUrl: "/gear/thresher.jpg",
    category: {
      name: "Processing",
    },
  },

  {
    id: "15",
    name: "Battery Sprayer",
    brand: "Walton",
    description:
      "Portable battery powered spraying equipment.",
    pricePerDay: 700,
    stockQuantity: 25,
    availableQuantity: 20,
    imageUrl: "/gear/battery-sprayer.jpg",
    category: {
      name: "Spraying",
    },
  },

  {
    id: "16",
    name: "Cultivator Machine",
    brand: "Mahindra",
    description:
      "Soil cultivation machine for farming preparation.",
    pricePerDay: 3200,
    stockQuantity: 6,
    availableQuantity: 5,
    imageUrl: "/gear/cultivator.jpg",
    category: {
      name: "Cultivation",
    },
  },

  {
    id: "17",
    name: "Mini Harvester",
    brand: "VST",
    description:
      "Compact harvesting machine for small farms.",
    pricePerDay: 6000,
    stockQuantity: 2,
    availableQuantity: 1,
    imageUrl: "/gear/mini-harvester.jpg",
    category: {
      name: "Harvesting",
    },
  },

  {
    id: "18",
    name: "Fertilizer Spreader",
    brand: "Fieldking",
    description:
      "Equipment for uniform fertilizer distribution.",
    pricePerDay: 1400,
    stockQuantity: 9,
    availableQuantity: 7,
    imageUrl: "/gear/spreader.jpg",
    category: {
      name: "Fertilizing",
    },
  },

  {
    id: "19",
    name: "Seed Cleaner Machine",
    brand: "AgroTech",
    description:
      "Machine for cleaning and processing seeds.",
    pricePerDay: 2200,
    stockQuantity: 4,
    availableQuantity: 3,
    imageUrl: "/gear/seed-cleaner.jpg",
    category: {
      name: "Processing",
    },
  },

  {
    id: "20",
    name: "Electric Irrigation Pump",
    brand: "Singer",
    description:
      "Energy efficient electric pump for irrigation.",
    pricePerDay: 1300,
    stockQuantity: 15,
    availableQuantity: 12,
    imageUrl: "/gear/electric-pump.jpg",
    category: {
      name: "Irrigation",
    },
  },
];


export default function Equipments() {

  const [showAll, setShowAll] = useState(false);

  const visibleEquipments = showAll
    ? equipments
    : equipments.slice(0, 12);



  return (
    <section className="max-w-7xl mx-auto w-full space-y-8">


      <div
        className="
        grid
        gap-5
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        "
      >

        {
          visibleEquipments.map((gear)=>(
            <GearCard
              key={gear.id}
              gear={gear}
              onView={(item)=>{
                console.log(item);
              }}
            />
          ))
        }


      </div>



      {
        equipments.length > 12 && (

          <div className="flex justify-center">

            <Button
              variant="outline"
              onClick={()=>setShowAll(!showAll)}
            >

              {
                showAll
                ? "Show Less"
                : "Show More"
              }

            </Button>

          </div>

        )
      }


    </section>
  );
}