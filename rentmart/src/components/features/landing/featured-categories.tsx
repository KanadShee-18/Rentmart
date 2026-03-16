"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/use-category";
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
  type LucideIcon,
} from "lucide-react";

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

export function FeaturedCategories() {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <section id='featured-categories' className='py-6'>
        <h2 className='text-3xl font-semibold tracking-[-0.045em] text-neutral-900 sm:text-[2.4rem]'>
          Featured Equipment Categories
        </h2>
        <div className='mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex flex-col items-center gap-3'>
              <div className='w-full max-w-[12rem] aspect-[1.05] rounded-[1.75rem] bg-neutral-100 animate-pulse' />
              <div className='h-5 w-24 rounded bg-neutral-100 animate-pulse' />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section id='featured-categories' className='py-6'>
      <h2 className='text-3xl font-semibold tracking-[-0.045em] text-neutral-900 sm:text-[2.4rem]'>
        Featured Equipment Categories
      </h2>
      <div className='mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4'>
        {categories.map((category) => {
          const Icon = getIcon(category.name);
          return (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className='group flex flex-col items-center text-center'
            >
              <div className='relative flex aspect-[1.05] w-full max-w-[12rem] items-center justify-center rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.96))] p-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/80 transition duration-200 group-hover:-translate-y-1 overflow-hidden'>
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className='object-cover rounded-[1.75rem]'
                  />
                ) : (
                  <Icon
                    className='size-12 text-neutral-400'
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <h3 className='mt-4 text-xl font-semibold tracking-[-0.03em] text-neutral-900'>
                {category.name}
              </h3>
              {category.description && (
                <p className='mt-1 text-sm text-neutral-500 line-clamp-2 max-w-[10rem]'>
                  {category.description}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
