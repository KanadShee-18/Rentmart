"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, LayoutDashboard, Shapes } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/verify", label: "Verification", icon: BadgeCheck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && !isAdmin) router.replace("/");
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground text-sm'>Loading…</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#fffdf7_58%,_#ffffff_100%)] pt-20 pb-10'>
      <div className='mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-[248px_minmax(0,1fr)] lg:px-8'>
        <aside className='lg:sticky lg:top-24 lg:self-start'>
          <div className='overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,_rgba(24,24,27,0.98),_rgba(17,17,19,0.96))] p-5 text-white shadow-[0_28px_60px_rgba(15,23,42,0.22)] ring-1 ring-black/20'>
            <Link
              href={"/"}
              className='text-blue-500 hover:text-blue-600 cursor-pointer hover:underline underline-offset-4 text-sm px-2'
            >
              Back to Home
            </Link>
            <p className='mb-4 px-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45'>
              Admin Panel
            </p>
            <nav className='space-y-2'>
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all ${
                    pathname === href
                      ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(255,255,255,0.08)] ring-1 ring-white/10"
                      : "text-white/62 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon className='size-4 shrink-0' />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className='min-w-0 rounded-[2rem] border border-white/65 bg-[linear-gradient(180deg,_rgba(255,255,255,0.86),_rgba(255,251,240,0.92))] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.14)] ring-1 ring-neutral-200/70 backdrop-blur md:p-6 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
