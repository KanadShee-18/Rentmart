"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEquipmentById } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-category";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function ProductDetailSkeleton() {
  return (
    <div className='w-full min-h-screen max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16 animate-pulse'>
      <div className='rounded-4xl border p-4 md:p-6 space-y-4'>
        <div className='h-24 md:h-28 w-full rounded-3xl bg-muted' />
        <div className='grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-4'>
          <div className='h-80 rounded-3xl bg-muted' />
          <div className='h-80 rounded-3xl bg-muted' />
        </div>
        <div className='h-40 rounded-3xl bg-muted' />
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
  const heroImage = item.images[0];

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.1),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.09),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fffdf7_58%,#ffffff_100%)]'>
      <div className='w-full min-h-screen max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-16'>
        <nav className='mb-4 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap'>
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
          <span className='text-foreground font-medium truncate max-w-55'>
            {item.name}
          </span>
        </nav>

        <div className='rounded-4xl border border-white/70 bg-white/75 p-4 md:p-6 space-y-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm'>
          <header className='rounded-3xl border bg-linear-to-r from-muted/80 via-muted/40 to-transparent p-5 md:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2'>
                  Product Overview
                </p>
                <h1 className='text-2xl md:text-3xl font-semibold leading-tight'>
                  {item.name}
                </h1>
              </div>
              <Badge variant='secondary'>{item.category.name}</Badge>
            </div>
          </header>

          <section className='grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-4'>
            <article className='rounded-3xl border bg-card p-5 md:p-6 min-h-75'>
              <h2 className='text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4'>
                About
              </h2>
              <p className='text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-wrap'>
                {item.description ||
                  "No description added yet. Contact the owner for full product details."}
              </p>
              <Separator className='my-5' />
              <p className='text-xs text-muted-foreground'>
                Listed by{" "}
                <span className='text-foreground'>{item.owner.name}</span>
              </p>
              <div className='mt-5 space-y-3'>
                <Separator />
                <h3 className='text-base font-semibold'>Details</h3>
                <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='rounded-xl border bg-card p-4'>
                    <dt className='text-xs text-muted-foreground mb-1'>
                      Category
                    </dt>
                    <dd className='font-medium text-sm'>
                      {item.category.name}
                    </dd>
                  </div>
                  <div className='rounded-xl border bg-card p-4'>
                    <dt className='text-xs text-muted-foreground mb-1'>
                      Price
                    </dt>
                    <dd className='font-medium text-sm'>{priceFormatted}</dd>
                  </div>
                  {item.location && (
                    <div className='rounded-xl border bg-card p-4'>
                      <dt className='text-xs text-muted-foreground mb-1'>
                        Location
                      </dt>
                      <dd className='font-medium text-sm'>{item.location}</dd>
                    </div>
                  )}
                  <div className='rounded-xl border bg-card p-4'>
                    <dt className='text-xs text-muted-foreground mb-1'>
                      Listed on
                    </dt>
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
            </article>

            <article className='rounded-3xl border bg-card p-3 md:p-4 flex flex-col min-h-75'>
              <div className='relative w-full aspect-video rounded-2xl overflow-hidden bg-muted'>
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={item.name}
                    fill
                    className='object-cover'
                    priority
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-sm text-muted-foreground'>
                    No image available
                  </div>
                )}
              </div>
              <div className='flex-1 px-1 py-4'>
                <h3 className='text-base font-medium mb-1'>Area / Location</h3>
                <p className='text-sm text-muted-foreground'>
                  {item.location || "Location not specified"}
                </p>
              </div>
              <Button className='w-full rounded-xl h-11 text-base'>
                {priceFormatted}
              </Button>
            </article>
          </section>

          <section className='rounded-3xl border bg-card p-5 md:p-6 min-h-40'>
            <h2 className='text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3'>
              Review Section
            </h2>
            <p className='text-sm text-muted-foreground'>
              Reviews are coming soon. Once users start renting, feedback will
              appear here.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
