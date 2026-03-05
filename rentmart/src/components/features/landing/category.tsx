"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/use-category";
import { MainHeading } from "@/components/common/main-heading";

const PALETTE = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
  "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
  "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20",
];

const ICON_MAP: [string, string][] = [
  ["camera", "📷"],
  ["photo", "📷"],
  ["audio", "🎵"],
  ["music", "🎸"],
  ["instrument", "🎹"],
  ["tool", "🔧"],
  ["construct", "🏗️"],
  ["outdoor", "⛺"],
  ["camping", "⛺"],
  ["sport", "⚽"],
  ["fitness", "🏋️"],
  ["vehicle", "🚗"],
  ["car", "🚗"],
  ["bike", "🚴"],
  ["party", "🎉"],
  ["event", "🎉"],
  ["electr", "💻"],
  ["gadget", "📱"],
  ["power", "⚡"],
  ["water", "🌊"],
  ["garden", "🌿"],
  ["home", "🏠"],
];

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of ICON_MAP) {
    if (lower.includes(key)) return emoji;
  }
  return "📦";
}

export const Category = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className='pb-20 border-b space-y-4'>
        <MainHeading headingText='Browse by Category' />
        <div className='flex gap-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='w-32 h-10 rounded-xl bg-muted animate-pulse shrink-0'
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
      <div className='flex gap-3 overflow-x-auto pb-1 scrollbar-hide'>
        {categories.map((cat, i) => {
          const palette = PALETTE[i % PALETTE.length];
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`flex items-center gap-2 shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm ${palette}`}
            >
              <span className='text-base leading-none'>{getIcon(cat.name)}</span>
              <span className='whitespace-nowrap'>{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

