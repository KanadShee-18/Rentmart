"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Shapes } from "lucide-react";
import { useAdminPendingEquipment } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-category";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: pending = [] } = useAdminPendingEquipment();
  const { data: categories = [] } = useCategories();

  return (
    <div className='space-y-6'>
      <section className='rounded-[1.85rem] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.82),_rgba(254,247,236,0.92))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/70'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500'>
          Admin Overview
        </p>
        <h1 className='mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-900'>
          Dashboard
        </h1>
        <p className='mt-2 max-w-2xl text-sm leading-6 text-neutral-600'>
          Manage categories and review equipment submissions from one unified
          workspace.
        </p>
      </section>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link
          href='/admin/verify'
          className='group rounded-[1.7rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/70 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]'
        >
          <div className='mb-6 inline-flex rounded-2xl bg-neutral-100 p-3 text-neutral-700 ring-1 ring-neutral-200'>
            <BadgeCheck className='size-6' strokeWidth={1.8} />
          </div>
          <p className='text-4xl font-bold tabular-nums text-neutral-900'>
            {pending.length}
          </p>
          <p className='mt-1 text-sm text-neutral-600'>Pending Verifications</p>
          <div className='mt-6 flex items-center gap-2 text-sm font-medium text-neutral-900'>
            Open queue
            <ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
          </div>
        </Link>

        <Link
          href='/admin/categories'
          className='group rounded-[1.7rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/70 transition-all hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]'
        >
          <div className='mb-6 inline-flex rounded-2xl bg-neutral-100 p-3 text-neutral-700 ring-1 ring-neutral-200'>
            <Shapes className='size-6' strokeWidth={1.8} />
          </div>
          <p className='text-4xl font-bold tabular-nums text-neutral-900'>
            {categories.length}
          </p>
          <p className='mt-1 text-sm text-neutral-600'>Categories</p>
          <div className='mt-6 flex items-center gap-2 text-sm font-medium text-neutral-900'>
            Manage catalog
            <ArrowRight className='size-4 transition-transform group-hover:translate-x-1' />
          </div>
        </Link>
      </div>
    </div>
  );
}
