"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useVerifiedEquipment } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-category";

const CategoryIdPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: items = [], isLoading } = useVerifiedEquipment(categoryId);
  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === categoryId);

  return (
    <div className='w-full min-h-screen max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-16 space-y-6'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-1.5 text-sm text-muted-foreground'>
        <Link href='/' className='hover:text-foreground transition-colors'>
          Home
        </Link>
        <span>/</span>
        <span className='text-foreground font-medium'>
          {category?.name ?? "Category"}
        </span>
      </nav>

      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          {category?.name ?? "Category"}
        </h1>
        {category?.description && (
          <p className='text-muted-foreground text-sm mt-1'>
            {category.description}
          </p>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='w-full aspect-square rounded-xl bg-muted animate-pulse' />
              <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
              <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className='rounded-2xl border border-dashed flex flex-col items-center justify-center h-64 gap-3'>
          <p className='text-3xl'>🔍</p>
          <p className='text-muted-foreground text-sm'>
            No listings in this category yet.
          </p>
          <Link
            href='/'
            className='text-primary text-sm underline underline-offset-4'
          >
            Browse all categories
          </Link>
        </div>
      ) : (
        <>
          <p className='text-xs text-muted-foreground'>
            {items.length} item{items.length !== 1 ? "s" : ""} available
          </p>
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
                </div>
                <div className='mt-2 space-y-0.5'>
                  <p className='text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200'>
                    {item.name}
                  </p>
                  {item.description && (
                    <p className='text-xs text-muted-foreground line-clamp-2'>
                      {item.description}
                    </p>
                  )}
                  {item.location && (
                    <p className='text-xs text-muted-foreground truncate'>
                      📍 {item.location}
                    </p>
                  )}
                  <p className='text-sm font-bold text-primary'>
                    ₹{Number(item.pricePerDay).toLocaleString("en-IN")}/day
                  </p>
                  <div className='flex items-center gap-1.5 pt-1'>
                    <div className='w-5 h-5 rounded-full bg-muted border flex items-center justify-center text-xs font-semibold'>
                      {item.owner.name.charAt(0).toUpperCase()}
                    </div>
                    <p className='text-xs text-muted-foreground truncate'>
                      {item.owner.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default CategoryIdPage;
