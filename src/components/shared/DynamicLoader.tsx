import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type LoaderSection = {
  kind:
    | "hero"
    | "cards"
    | "table"
    | "details"
    | "form"
    | "list"
    | "text"
    | "custom";
  title?: string;
  subtitle?: string;
  rows?: number;
  columns?: number;
  cards?: number;
  items?: number;
  children?: ReactNode;
  className?: string;
};

function renderTitle(title?: string, subtitle?: string) {
  if (!title && !subtitle) return null;

  return (
    <div className="space-y-2">
      {title ? <Skeleton className="h-8 w-2/5 rounded-md" /> : null}
      {subtitle ? <Skeleton className="h-4 w-3/5 rounded-md" /> : null}
    </div>
  );
}

function renderHero() {
  return (
    <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <Skeleton className="h-72 w-full rounded-3xl" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4 rounded-full" />
        <Skeleton className="h-5 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

function renderCards(count = 4) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => index).map((index) => (
        <div key={index} className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-5 w-2/3 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function renderTable(rows = 5, columns = 4) {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {Array.from({ length: columns }, (_, index) => index).map((index) => (
          <Skeleton key={index} className="h-5 w-1/4 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, rowIndex) => rowIndex).map((rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-3">
            {Array.from({ length: columns }, (_, columnIndex) => columnIndex).map((columnIndex) => (
              <Skeleton key={columnIndex} className="h-5 w-full rounded-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderDetails() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
      </div>
      <div className="space-y-4 rounded-3xl border border-border bg-card p-4 shadow-sm">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-1/3 rounded-full" />
            <Skeleton className="h-5 w-full rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function renderForm() {
  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-1/3 rounded-full" />
          <Skeleton className="h-12 w-full rounded-3xl" />
        </div>
      ))}
      <Skeleton className="h-12 w-1/3 rounded-3xl" />
    </div>
  );
}

function renderList(items = 3) {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-3xl border border-muted p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function renderText() {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
      <Skeleton className="h-6 w-1/3 rounded-full" />
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-4 w-4/5 rounded-full" />
    </div>
  );
}

export default function DynamicLoader({ sections }: { sections: LoaderSection[] }) {
  return (
    <main className="space-y-8 p-6 md:p-8">
      {sections.map((section, index) => (
        <div key={index} className={section.className ?? "space-y-6"}>
          {renderTitle(section.title, section.subtitle)}
          {section.kind === "hero" && renderHero()}
          {section.kind === "cards" && renderCards(section.cards)}
          {section.kind === "table" && renderTable(section.rows, section.columns)}
          {section.kind === "details" && renderDetails()}
          {section.kind === "form" && renderForm()}
          {section.kind === "list" && renderList(section.items)}
          {section.kind === "text" && renderText()}
          {section.kind === "custom" && section.children}
        </div>
      ))}
    </main>
  );
}
