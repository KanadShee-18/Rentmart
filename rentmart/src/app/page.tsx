"use client";

import { Footer } from "@/components/common/footer";
import { FeaturedCategories } from "@/components/features/landing/featured-categories";
import { RecentItems } from "@/components/features/landing/recent-items";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight } from "lucide-react";
import { motion, type Transition } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Easy Booking & Availability",
    image: "/core/bookings.jpg",
  },
  {
    title: "Secure Payments & Insurance",
    image: "/core/payments.jpg",
  },
  {
    title: "Maximize Your Income",
    image: "/core/growth.jpg",
  },
];

export default function Page() {
  const { isAdmin, isOwner } = useAuth();
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fffdf7_58%,#ffffff_100%)]'>
      <div className='mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-12 pt-24 md:px-10 lg:pt-16'>
        <section className='grid items-center gap-10 pb-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-6'>
          <div className='max-w-2xl'>
            <motion.h1
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              className='max-w-3xl text-4xl font-semibold tracking-tighter text-balance text-neutral-900 sm:text-5xl lg:text-6xl lg:leading-[0.95]'
            >
              Access the Power to Build, Without the Cost of Ownership
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.15,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
              className='mt-6 max-w-xl text-base font-medium leading-7 text-neutral-500 sm:text-lg'
            >
              Stop letting equipment costs hold your projects back. Whether you
              need gear for a day or specialized tools for a month, our secure
              marketplace connects renters with local owners and turns idle
              assets into steady income.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.3,
                ease: "easeOut",
                delayChildren: 0.2,
              }}
              viewport={{ once: true }}
              className='mt-8 flex flex-col gap-3 sm:flex-row'
            >
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
              {(isAdmin || !isOwner) && (
                <Button
                  size='lg'
                  className='h-12 min-w-44 justify-between rounded-2xl bg-neutral-900 px-5 text-[15px] font-semibold text-white shadow-[0_16px_36px_rgba(15,23,42,0.18)] hover:bg-neutral-800'
                >
                  <Link
                    href='/list-product'
                    className='flex w-full items-center justify-between gap-4'
                  >
                    {isAdmin ? "Visit Admin Panel" : "List Your Gear"}
                    <ArrowRight className='size-4' />
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.35,
              duration: 0.4,
              ease: "easeInOut",
            }}
            viewport={{ once: true }}
            className='relative'
          >
            <Image
              src='/core/landing-pic.png'
              alt='Construction and equipment rental illustration'
              width={1200}
              height={900}
              priority
              className='h-auto w-full object-cover'
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
                WebkitMaskComposite: "source-in",
              }}
            />
          </motion.div>
        </section>

        <section className='gap-5 py-16 flex flex-wrap justify-around'>
          {highlights.map(({ title, image }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                delay: i * 0.25,
              }}
              className='group w-full md:w-1/4 relative aspect-4/3 overflow-hidden rounded-[1.65rem] border border-neutral-200/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1'
            >
              <Image
                src={image}
                alt={title}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-105'
              />
              <div className='pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-white/95 via-white/60 to-transparent' />
              <h2 className='absolute inset-x-0 bottom-0 p-6 text-[1.8rem] font-semibold leading-tight tracking-[-0.04em] text-neutral-900'>
                {title}
              </h2>
            </motion.article>
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
