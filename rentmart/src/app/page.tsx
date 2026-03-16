import { Footer } from "@/components/common/footer";
import { FeaturedCategories } from "@/components/features/landing/featured-categories";
import { RecentItems } from "@/components/features/landing/recent-items";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Easy Booking & Availability",
    icon: CalendarDays,
  },
  {
    title: "Secure Payments & Insurance",
    icon: ShieldCheck,
  },
  {
    title: "Maximize Your Income",
    icon: BadgeDollarSign,
  },
];

export default function Page() {
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#fffdf7_58%,_#ffffff_100%)]'>
      <div className='mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-12 pt-24 md:px-10 lg:pt-28'>
        <section className='grid items-center gap-10 border-b border-border/60 pb-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6'>
          <div className='max-w-2xl'>
            <h1 className='max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-balance text-neutral-900 sm:text-5xl lg:text-[4.1rem] lg:leading-[0.95]'>
              Access the Power to Build, Without the Cost of Ownership
            </h1>
            <p className='mt-6 max-w-xl text-base font-medium leading-7 text-neutral-600 sm:text-lg'>
              Stop letting equipment costs hold your projects back. Whether you
              need gear for a day or specialized tools for a month, our secure
              marketplace connects renters with local owners and turns idle
              assets into steady income.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Button
                size='lg'
                className='h-12 min-w-44 justify-between rounded-2xl bg-white px-5 text-[15px] font-semibold text-neutral-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200 hover:bg-neutral-50'
                variant='outline'
              >
                <Link
                  href='#featured-categories'
                  className='flex w-full items-center justify-between gap-4'
                >
                  Explore Products
                  <ArrowRight className='size-4' />
                </Link>
              </Button>
              <Button
                size='lg'
                className='h-12 min-w-44 justify-between rounded-2xl bg-neutral-900 px-5 text-[15px] font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.18)] hover:bg-neutral-800'
              >
                <Link
                  href='/list-product'
                  className='flex w-full items-center justify-between gap-4'
                >
                  List Your Gear
                  <ArrowRight className='size-4' />
                </Link>
              </Button>
            </div>
          </div>

          <div className='relative'>
            <div className='pointer-events-none absolute inset-x-6 bottom-4 top-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.18),_transparent_58%)] blur-3xl' />
            <div className='relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur'>
              <Image
                src='/core/landing-pic.png'
                alt='Construction and equipment rental illustration'
                width={1200}
                height={900}
                priority
                className='h-auto w-full rounded-[1.5rem] object-cover'
              />
            </div>
          </div>
        </section>

        <section className='grid gap-4 py-12 md:grid-cols-3'>
          {highlights.map(({ title, icon: Icon }) => (
            <article
              key={title}
              className='rounded-[1.65rem] border border-neutral-200/80 bg-white px-6 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1'
            >
              <div className='mb-5 inline-flex rounded-2xl bg-neutral-50 p-3 text-neutral-700 ring-1 ring-neutral-200'>
                <Icon className='size-7' strokeWidth={1.9} />
              </div>
              <h2 className='max-w-[14ch] text-[1.8rem] font-semibold leading-tight tracking-[-0.04em] text-neutral-900'>
                {title}
              </h2>
            </article>
          ))}
        </section>

        <FeaturedCategories />

        <RecentItems />

        <div className='mt-auto pt-10'>
          <Footer />
        </div>
      </div>
    </div>
  );
}
