"use client";

import Image from "next/image";
import { useVerifiedEquipment } from "@/hooks/use-equipment";
import { MainHeading } from "@/components/common/main-heading";

export const RecentItems = () => {
  const { data: items = [], isLoading } = useVerifiedEquipment();
  const recent = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className='pb-20 border-b space-y-4'>
        <MainHeading headingText='Recently Listed' />
        <div className='flex gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='min-w-52 space-y-2 shrink-0'>
              <div className='w-full aspect-video rounded-xl bg-muted animate-pulse' />
              <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
              <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recent.length === 0) return null;

  return (
    <div className='pb-20 border-b space-y-4'>
      <MainHeading headingText='Recently Listed' />
      <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
        {recent.map((item) => (
          <div key={item.id} className='min-w-52 lg:min-w-60 shrink-0 group'>
            <div className='overflow-hidden rounded-xl border bg-muted'>
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={400}
                  height={280}
                  className='w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300'
                />
              ) : (
                <div className='w-full aspect-video flex items-center justify-center text-muted-foreground text-xs'>
                  No image
                </div>
              )}
            </div>
            <div className='mt-2 space-y-0.5'>
              <p className='text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200'>
                {item.name}
              </p>
              <p className='text-xs text-muted-foreground'>
                {item.category.name}
              </p>
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

