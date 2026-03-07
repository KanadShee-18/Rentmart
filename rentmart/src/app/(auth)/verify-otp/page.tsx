"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useResendOtp, useVerifyOtp } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    error: verifyError,
    isSuccess,
  } = useVerifyOtp();

  const {
    mutate: resendOtp,
    isPending: isResending,
    error: resendError,
    isSuccess: resendSuccess,
  } = useResendOtp();

  // Redirect to login if no email provided
  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  // Start cooldown timer after resend
  useEffect(() => {
    if (resendSuccess) {
      setCooldown(RESEND_COOLDOWN);
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp({ email, otp });
  };

  const handleResend = () => {
    resendOtp({ email });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (err: unknown) =>
    err && "response" in (err as object)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((err as any).response?.data?.message ?? (err as any).message)
      : (err as Error)?.message;

  if (!email) return null;

  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='space-y-1 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Verify your email</h1>
        <p className='text-muted-foreground text-sm'>
          We sent a 6-digit code to{" "}
          <span className='text-foreground font-medium'>{email}</span>. Enter it
          below to activate your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='otp'>Verification code</Label>
          <Input
            id='otp'
            type='text'
            inputMode='numeric'
            placeholder='123456'
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            autoComplete='one-time-code'
            className='text-center text-xl tracking-[0.5em]'
          />
        </div>

        {verifyError && (
          <p className='text-destructive text-sm'>
            {getErrorMessage(verifyError)}
          </p>
        )}

        {isSuccess && (
          <p className='text-sm text-green-600'>
            Email verified! Redirecting to login…
          </p>
        )}

        <Button
          type='submit'
          className='w-full'
          disabled={isVerifying || otp.length < 6}
        >
          {isVerifying ? "Verifying…" : "Verify Email"}
        </Button>
      </form>

      <div className='space-y-2 text-center'>
        <p className='text-muted-foreground text-sm'>
          Didn&apos;t receive the code?
        </p>

        {resendError && (
          <p className='text-destructive text-sm'>
            {getErrorMessage(resendError)}
          </p>
        )}
        {resendSuccess && cooldown > 0 && (
          <p className='text-sm text-green-600'>Code resent successfully!</p>
        )}

        <Button
          type='button'
          variant='outline'
          className='w-full'
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
        >
          {isResending
            ? "Sending…"
            : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
        </Button>
      </div>

      <p className='text-center text-sm text-muted-foreground'>
        Wrong email?{" "}
        <Link
          href='/signup'
          className='text-primary underline underline-offset-4'
        >
          Sign up again
        </Link>
      </p>
    </div>
  );
}
