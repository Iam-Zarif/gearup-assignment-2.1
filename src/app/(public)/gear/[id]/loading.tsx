import DynamicLoader from "@/src/components/shared/DynamicLoader";

export default function Loading() {
  return (
    <DynamicLoader
      sections={[
        { kind: "hero" },
        { kind: "cards", cards: 1 },
        { kind: "list", items: 3 },
      ]}
    />
  );
}
