"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Camera,
  Music,
  Wrench,
  Tent,
  Dumbbell,
  Car,
  Bike,
  CalendarDays,
  Laptop,
  Zap,
  Waves,
  Leaf,
  Home,
  Package,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useCategories } from "@/hooks/use-category";
import { MainHeading } from "@/components/common/main-heading";

const ICON_MAP: [string, LucideIcon][] = [
  ["camera", Camera],
  ["photo", Camera],
  ["audio", Music],
  ["music", Music],
  ["instrument", Music],
  ["tool", Wrench],
  ["construct", Wrench],
  ["outdoor", Tent],
  ["camping", Tent],
  ["sport", Dumbbell],
  ["fitness", Dumbbell],
  ["vehicle", Car],
  ["car", Car],
  ["bike", Bike],
  ["party", CalendarDays],
  ["event", CalendarDays],
  ["electr", Laptop],
  ["gadget", Laptop],
  ["power", Zap],
  ["water", Waves],
  ["garden", Leaf],
  ["home", Home],
];

function getIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const [key, Icon] of ICON_MAP) {
    if (lower.includes(key)) return Icon;
  }
  return Package;
}

export const Category = () => {
  const { data: categories = [], isLoading } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, categories]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className='pb-20 border-b space-y-4'>
        <MainHeading headingText='Browse by Category' />
        <div className='flex gap-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='w-28 h-9 rounded-md bg-muted animate-pulse shrink-0'
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className='pb-20 border-b space-y-4'>
      <MainHeading headingText='Browse by Category' />
      <div className='relative flex items-center gap-2'>
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label='Scroll left'
          className='shrink-0 rounded-md border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30'
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={scrollRef}
          className='flex gap-2 overflow-x-auto pb-0 scrollbar-hide scroll-smooth'
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const Icon = getIcon(cat.name);
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className='flex items-center gap-2 shrink-0 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted'
              >
                <Icon size={15} className='text-muted-foreground shrink-0' />
                <span className='whitespace-nowrap'>{cat.name}</span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label='Scroll right'
          className='shrink-0 rounded-md border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30'
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
