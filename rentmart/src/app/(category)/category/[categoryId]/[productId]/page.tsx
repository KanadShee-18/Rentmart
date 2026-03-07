"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEquipmentById } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-category";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function ImageBentoGrid({ images, name }: { images: string[]; name: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className='w-full aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-sm'>
        No images available
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className='w-full aspect-video rounded-2xl overflow-hidden relative'>
        <Image
          src={images[0]}
          alt={name}
          fill
          className='object-cover'
          priority
        />
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {/* Main image */}
      <div className='w-full aspect-video rounded-2xl overflow-hidden relative'>
        <Image
          src={images[activeIdx]}
          alt={`${name} - image ${activeIdx + 1}`}
          fill
          className='object-cover transition-all duration-300'
          priority
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className='grid grid-cols-5 gap-2'>
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIdx
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className='object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className='w-full min-h-screen max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-16 space-y-6 animate-pulse'>
      <div className='h-4 w-48 rounded bg-muted' />
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
        <div className='lg:col-span-3 space-y-2'>
          <div className='w-full aspect-video rounded-2xl bg-muted' />
          <div className='grid grid-cols-5 gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='aspect-square rounded-xl bg-muted' />
            ))}
          </div>
        </div>
        <div className='lg:col-span-2 space-y-4'>
          <div className='h-8 w-3/4 rounded bg-muted' />
          <div className='h-5 w-1/3 rounded bg-muted' />
          <div className='h-24 w-full rounded bg-muted' />
          <div className='h-12 w-full rounded bg-muted' />
        </div>
      </div>
    </div>
  );
}

const ProductDetailPage = () => {
  const { categoryId, productId } = useParams<{
    categoryId: string;
    productId: string;
  }>();

  const { data: item, isLoading, isError } = useEquipmentById(productId);
  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === categoryId);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !item) {
    return (
      <div className='w-full min-h-screen max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-16 flex flex-col items-center justify-center gap-4'>
        <p className='text-4xl'>😕</p>
        <p className='text-lg font-semibold'>Product not found</p>
        <Link
          href={`/category/${categoryId}`}
          className='text-primary underline underline-offset-4 text-sm'
        >
          Back to {category?.name ?? "category"}
        </Link>
      </div>
    );
  }

  const priceFormatted = `₹${Number(item.pricePerDay).toLocaleString("en-IN")}/day`;

  return (
    <div className='w-full min-h-screen max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-16 space-y-8'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap'>
        <Link href='/' className='hover:text-foreground transition-colors'>
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/category/${categoryId}`}
          className='hover:text-foreground transition-colors'
        >
          {category?.name ?? item.category.name}
        </Link>
        <span>/</span>
        <span className='text-foreground font-medium truncate max-w-[200px]'>
          {item.name}
        </span>
      </nav>

      {/* Main layout */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start'>
        {/* Left: Image bento grid */}
        <div className='lg:col-span-3'>
          <ImageBentoGrid images={item.images} name={item.name} />
        </div>

        {/* Right: Details panel */}
        <div className='lg:col-span-2 space-y-5 lg:sticky lg:top-24'>
          {/* Title + badge */}
          <div className='space-y-2'>
            <div className='flex items-start justify-between gap-2'>
              <h1 className='text-2xl md:text-3xl font-bold leading-tight'>
                {item.name}
              </h1>
              <Badge variant='secondary' className='shrink-0 mt-1'>
                {item.category.name}
              </Badge>
            </div>
            {item.location && (
              <p className='text-sm text-muted-foreground flex items-center gap-1'>
                <span>📍</span>
                {item.location}
              </p>
            )}
          </div>

          <Separator />

          {/* Price + CTA */}
          <div className='rounded-2xl border bg-card p-5 space-y-4'>
            <div className='flex items-baseline gap-1'>
              <span className='text-3xl font-extrabold text-primary'>
                ₹{Number(item.pricePerDay).toLocaleString("en-IN")}
              </span>
              <span className='text-muted-foreground text-sm font-medium'>
                / day
              </span>
            </div>
            <Button className='w-full h-11 text-base font-semibold rounded-xl'>
              Rent Now
            </Button>
            <Button
              variant='outline'
              className='w-full h-11 text-base rounded-xl'
            >
              Contact Owner
            </Button>
          </div>

          {/* Owner info */}
          <div className='flex items-center gap-3 rounded-2xl border bg-card p-4'>
            <div className='w-10 h-10 rounded-full bg-muted border flex items-center justify-center text-base font-bold shrink-0'>
              {item.owner.name.charAt(0).toUpperCase()}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold truncate'>
                {item.owner.name}
              </p>
              <p className='text-xs text-muted-foreground'>Owner</p>
            </div>
          </div>

          {/* Reviews placeholder */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-base'>Reviews</h3>
            <div className='rounded-2xl border border-dashed p-6 flex flex-col items-center gap-2 text-center'>
              <span className='text-2xl'>⭐</span>
              <p className='text-sm text-muted-foreground'>
                No reviews yet. Be the first to rent and leave a review!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description section - full width below */}
      {item.description && (
        <div className='space-y-3 max-w-3xl'>
          <Separator />
          <h2 className='text-xl font-semibold'>About this listing</h2>
          <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
            {item.description}
          </p>
        </div>
      )}

      {/* Additional details */}
      <div className='max-w-3xl space-y-3'>
        <Separator />
        <h2 className='text-xl font-semibold'>Details</h2>
        <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='rounded-xl border bg-card p-4'>
            <dt className='text-xs text-muted-foreground mb-1'>Category</dt>
            <dd className='font-medium text-sm'>{item.category.name}</dd>
          </div>
          <div className='rounded-xl border bg-card p-4'>
            <dt className='text-xs text-muted-foreground mb-1'>Price</dt>
            <dd className='font-medium text-sm'>{priceFormatted}</dd>
          </div>
          {item.location && (
            <div className='rounded-xl border bg-card p-4'>
              <dt className='text-xs text-muted-foreground mb-1'>Location</dt>
              <dd className='font-medium text-sm'>{item.location}</dd>
            </div>
          )}
          <div className='rounded-xl border bg-card p-4'>
            <dt className='text-xs text-muted-foreground mb-1'>Listed on</dt>
            <dd className='font-medium text-sm'>
              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProductDetailPage;
