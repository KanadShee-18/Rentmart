"use client";

import Link from "next/link";
import { useAdminPendingEquipment } from "@/hooks/use-equipment";
import { useCategories } from "@/hooks/use-category";

export default function AdminDashboard() {
  const { data: pending = [] } = useAdminPendingEquipment();
  const { data: categories = [] } = useCategories();

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Link
          href='/admin/verify'
          className='rounded-2xl border ring-1 ring-foreground/10 bg-card p-6 hover:ring-primary/50 transition-all'
        >
          <p className='text-4xl font-bold tabular-nums'>{pending.length}</p>
          <p className='text-muted-foreground text-sm mt-1'>
            Pending Verifications
          </p>
        </Link>

        <Link
          href='/admin/categories'
          className='rounded-2xl border ring-1 ring-foreground/10 bg-card p-6 hover:ring-primary/50 transition-all'
        >
          <p className='text-4xl font-bold tabular-nums'>{categories.length}</p>
          <p className='text-muted-foreground text-sm mt-1'>Categories</p>
        </Link>
      </div>
    </div>
  );
}
