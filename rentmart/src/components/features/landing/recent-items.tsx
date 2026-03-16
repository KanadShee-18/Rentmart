"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import { useVerifiedEquipment } from "@/hooks/use-equipment";
import { MainHeading } from "@/components/common/main-heading";

export const RecentItems = () => {
  const { data: items = [], isLoading } = useVerifiedEquipment();

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const recent = [...items]
    .filter((item) => new Date(item.createdAt).getTime() >= oneWeekAgo)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  if (isLoading) {
    return (
      <section className='py-10 space-y-5'>
        <MainHeading headingText='Recent Items' />
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(235,243,246,0.78))] p-3 shadow-[0_18px_40px_rgba(15,23,42,0.10)]'
            >
              <div className='aspect-4/5 rounded-[1.65rem] bg-muted animate-pulse' />
              <div className='mt-3 h-5 w-2/3 rounded bg-muted animate-pulse' />
              <div className='mt-2 h-4 w-1/2 rounded bg-muted animate-pulse' />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recent.length === 0) {
    return (
      <section className='py-10 space-y-5'>
        <MainHeading headingText='Recent Items' />
        <div className='rounded-[1.8rem] border border-dashed border-neutral-300/80 bg-white/70 p-10 text-center'>
          <p className='text-sm text-neutral-600'>
            No new listings in the last 7 days.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='py-10 space-y-5'>
      <div className='flex items-end justify-between gap-3'>
        <MainHeading headingText='Recent Items' />
        <p className='text-xs text-neutral-500'>Last 7 days</p>
      </div>

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {recent.map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.category.id}/${item.id}`}
            className='group rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(228,240,246,0.82))] p-3 shadow-[0_20px_45px_rgba(15,23,42,0.10)] ring-1 ring-white/55 transition-transform duration-300 hover:-translate-y-1'
          >
            <div className='relative overflow-hidden rounded-[1.55rem] border border-white/60 bg-muted'>
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={520}
                  height={640}
                  className='aspect-4/5 w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
              ) : (
                <div className='flex aspect-4/5 w-full items-center justify-center text-xs text-muted-foreground'>
                  No image
                </div>
              )}

              <div className='pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 via-black/20 to-transparent p-4 text-white'>
                <div className='flex items-start justify-between gap-2'>
                  <h3 className='line-clamp-2 text-lg font-semibold tracking-[-0.02em]'>
                    {item.name}
                  </h3>
                  <span className='shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur'>
                    ₹{Number(item.pricePerDay).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-3 space-y-3 px-1'>
              <p className='line-clamp-2 text-sm leading-6 text-slate-600'>
                {item.description ||
                  `${item.category.name} listing added recently. Check details for specs and availability.`}
              </p>

              <div className='flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-600'>
                <span className='inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-white/75 px-2 py-1'>
                  <Star className='size-3 fill-current' /> 4.8
                </span>
                <span className='rounded-full border border-slate-300/70 bg-white/75 px-2 py-1'>
                  {item.category.name}
                </span>
                <span className='inline-flex items-center gap-1 rounded-full border border-slate-300/70 bg-white/75 px-2 py-1'>
                  <Clock3 className='size-3' /> Fresh Listing
                </span>
              </div>

              <div className='rounded-full border border-slate-300/80 bg-white/90 py-2 text-center text-sm font-semibold text-slate-900 transition-colors group-hover:bg-slate-100'>
                Book now
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
