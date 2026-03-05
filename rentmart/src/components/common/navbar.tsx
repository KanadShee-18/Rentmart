"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./theme-toggler";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useLogout } from "@/hooks/use-auth";

export const Navbar = () => {
  const { user, isLoading, isAuthenticated, isOwner, isAdmin } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <div className='fixed top-0 dark:border-b inset-x-0 shadow-lg backdrop-blur-md z-999'>
      <div className='max-w-7xl mx-auto h-14 px-5 md:px-10 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-x-1.5'>
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
          <p className='text-xl font-jura font-extrabold text-neutral-700 dark:text-neutral-200 tracking-tighter'>
            Rentmart
          </p>
        </Link>
        <div className='flex items-center gap-x-2.5'>
          <ModeToggle />
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
                  <Link
                    href='/profile'
                    className='text-sm text-muted-foreground hidden sm:block hover:text-foreground transition-colors'
                  >
                    {user?.name}
                  </Link>
                  <Button
                    variant='outline'
                    size='sm'
                    className='hidden sm:flex'
                  >
                    <Link href='/profile'>Profile</Link>
                  </Button>
                  <Button
                    variant={"outline"}
                    disabled={isLoggingOut}
                    onClick={() => logout()}
                  >
                    {isLoggingOut ? "Logging out…" : "Log Out"}
                  </Button>
                </>
              ) : (
                <>
                  <Button className={"shadow-lg"} variant={"outline"}>
                    <Link href='/login'>Log In</Link>
                  </Button>
                  <Button>
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
