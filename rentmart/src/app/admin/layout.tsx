"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/verify", label: "Verification" },
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
    <div className='min-h-screen pt-16'>
      <div className='max-w-6xl mx-auto px-4 py-6 flex gap-6'>
        {/* Sidebar */}
        <aside className='w-48 shrink-0'>
          <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card p-4 space-y-1 sticky top-20'>
            <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2'>
              Admin Panel
            </p>
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === href
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className='flex-1 min-w-0'>{children}</main>
      </div>
    </div>
  );
}
