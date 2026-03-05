"use client";

import Image from "next/image";
import { useVerifiedEquipment } from "@/hooks/use-equipment";
import { MainHeading } from "@/components/common/main-heading";

export const TopPicks = () => {
  const { data: items = [], isLoading } = useVerifiedEquipment();

  if (isLoading) {
    return (
      <div className='pb-20 border-b space-y-4'>
        <MainHeading headingText='All Listings' />
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='w-full aspect-square rounded-xl bg-muted animate-pulse' />
              <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
              <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='pb-20 border-b space-y-4'>
        <MainHeading headingText='All Listings' />
        <div className='rounded-2xl border border-dashed flex flex-col items-center justify-center h-48 gap-2'>
          <p className='text-2xl'>📭</p>
          <p className='text-muted-foreground text-sm'>
            No listings yet. Be the first to list!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='pb-20 border-b space-y-4'>
      <div className='flex items-center justify-between'>
        <MainHeading headingText='All Listings' />
        <span className='text-xs text-muted-foreground tabular-nums'>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {items.map((item) => (
          <div key={item.id} className='group cursor-pointer'>
            <div className='overflow-hidden rounded-xl border bg-muted aspect-square relative'>
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-muted-foreground text-xs'>
                  No image
                </div>
              )}
              <span className='absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs font-medium px-2 py-0.5 rounded-full border'>
                {item.category.name}
              </span>
            </div>
            <div className='mt-2 space-y-0.5'>
              <p className='text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200'>
                {item.name}
              </p>
              {item.location && (
                <p className='text-xs text-muted-foreground truncate'>
                  📍 {item.location}
                </p>
              )}
              <p className='text-sm font-bold text-primary'>
                ₹{Number(item.pricePerDay).toLocaleString("en-IN")}/day
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

