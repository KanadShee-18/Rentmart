"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggler";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useLogout } from "@/hooks/use-auth";

export const Navbar = () => {
  const { user, isLoading, isAuthenticated, isOwner, isAdmin } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <div
      className={`fixed block inset-x-0 top-0 z-999 border-b border-neutral-200/70 backdrop-blur-md ${
        isHomePage
          ? "bg-white/92 shadow-none"
          : "bg-background/88 shadow-lg dark:border-white/10"
      } ${isAdminPage ? "hidden" : "block"} `}
    >
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10'>
        <Link href='/' className='flex items-center gap-x-1.5'>
          {!isHomePage && (
            <span>
              <Image
                src={"/core/rentmart-logo.png"}
                alt='RentMart'
                width={50}
                height={50}
                unoptimized
                className='invert dark:invert-0'
              />
            </span>
          )}
          <p
            className={`font-jura text-xl font-extrabold tracking-tighter ${
              isHomePage
                ? "text-neutral-900"
                : "text-neutral-700 dark:text-neutral-200"
            }`}
          >
            RENTMART
          </p>
        </Link>
        <div className='flex items-center gap-x-2.5'>
          {!isHomePage && <ModeToggle />}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='hidden sm:flex'
                    >
                      <Link href='/admin'>Admin Panel</Link>
                    </Button>
                  )}
                  {isOwner && (
                    <Button size='sm' className='hidden sm:flex'>
                      <Link href='/list-product'>List Equipment</Link>
                    </Button>
                  )}
                  {/* <Link
                    href='/profile'
                    className='text-sm text-muted-foreground hidden sm:block hover:text-foreground transition-colors'
                  >
                    {user?.name}
                  </Link> */}
                  <Button
                    variant='outline'
                    size='icon-sm'
                    className='hidden sm:flex'
                  >
                    <Link href='/profile'>{user?.name[0]}</Link>
                  </Button>
                  <Button
                    variant={"outline"}
                    disabled={isLoggingOut}
                    onClick={() => logout()}
                    className={isHomePage ? "rounded-2xl" : undefined}
                  >
                    {isLoggingOut ? "Logging out…" : "Log Out"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={
                      isHomePage
                        ? "rounded-2xl border-transparent bg-transparent px-3 text-neutral-900 shadow-none hover:bg-neutral-100"
                        : "shadow-lg"
                    }
                    variant={isHomePage ? "ghost" : "outline"}
                  >
                    <Link href='/login'>Login</Link>
                  </Button>
                  <Button
                    className={
                      isHomePage
                        ? "rounded-2xl bg-neutral-900 px-4 text-white hover:bg-neutral-800"
                        : undefined
                    }
                  >
                    <Link href='/signup'>Sign Up</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
