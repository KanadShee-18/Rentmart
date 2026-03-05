"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useChangePassword, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Owner",
  RENTER: "Renter",
  ADMIN: "Admin",
};

const ROLE_DESCRIPTION: Record<string, string> = {
  OWNER: "You can list equipment for rent.",
  RENTER: "You can browse and rent equipment.",
  ADMIN: "You have full administrative access.",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isOwner, isAuthenticated } = useAuth();
  const {
    mutate: changePassword,
    isPending,
    error,
    isSuccess,
    reset,
  } = useChangePassword();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  // Redirect to login if not authenticated once loading is done
  if (!isLoading && !isAuthenticated) {
    router.replace("/login");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground text-sm'>Loading profile…</p>
      </div>
    );
  }

  const serverError =
    error && "response" in (error as object)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((error as any).response?.data?.message ?? error.message)
      : error?.message;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    reset();

    if (newPassword !== confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <div className='min-h-screen pt-20 pb-12 px-4'>
      <div className='max-w-lg mx-auto space-y-6'>
        {/* — Profile card — */}
        <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card text-card-foreground p-6 space-y-5'>
          <h1 className='text-2xl font-bold tracking-tight'>My Profile</h1>

          {/* Name */}
          <div className='space-y-1'>
            <Label className='text-muted-foreground text-xs uppercase tracking-wide'>
              Full Name
            </Label>
            <p className='font-medium'>{user.name}</p>
          </div>

          {/* Email */}
          <div className='space-y-1'>
            <Label className='text-muted-foreground text-xs uppercase tracking-wide'>
              Email
            </Label>
            <p className='font-medium'>{user.email}</p>
          </div>

          {/* Role badge */}
          <div className='space-y-1.5'>
            <Label className='text-muted-foreground text-xs uppercase tracking-wide'>
              Role
            </Label>
            <div
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border ${
                isOwner
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : user.role === "ADMIN"
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }`}
            >
              <span>{ROLE_LABEL[user.role] ?? user.role}</span>
              {isOwner && (
                <span className='text-xs font-normal opacity-80'>
                  — {ROLE_DESCRIPTION.OWNER}
                </span>
              )}
            </div>
            {!isOwner && (
              <p className='text-xs text-muted-foreground'>
                {ROLE_DESCRIPTION[user.role]}
              </p>
            )}
          </div>

          <Separator />

          <Button
            variant='outline'
            size='sm'
            disabled={isLoggingOut}
            onClick={() => logout()}
          >
            {isLoggingOut ? "Logging out…" : "Log Out"}
          </Button>
        </div>

        {/* — Change password card — */}
        <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card text-card-foreground p-6 space-y-5'>
          <h2 className='text-lg font-semibold'>Change Password</h2>

          <form onSubmit={handlePasswordSubmit} className='space-y-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='oldPassword'>Current Password</Label>
              <Input
                id='oldPassword'
                type='password'
                placeholder='Your current password'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                autoComplete='current-password'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='newPassword'>New Password</Label>
              <Input
                id='newPassword'
                type='password'
                placeholder='Min. 8 characters'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoComplete='new-password'
              />
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='confirmPassword'>Confirm New Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Repeat new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete='new-password'
              />
            </div>

            {(clientError || serverError) && (
              <p className='text-destructive text-sm'>
                {clientError ?? serverError}
              </p>
            )}

            {isSuccess && (
              <p className='text-green-600 dark:text-green-400 text-sm'>
                Password updated successfully.
              </p>
            )}

            <Button type='submit' disabled={isPending}>
              {isPending ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
