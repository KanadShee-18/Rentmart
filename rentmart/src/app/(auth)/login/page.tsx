"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const errorMessage =
    error && "response" in (error as object)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((error as any).response?.data?.message ?? error.message)
      : error?.message;

  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='space-y-1 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Welcome back</h1>
        <p className='text-muted-foreground text-sm'>
          Sign in to your Rentmart account
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='email'
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='current-password'
          />
        </div>

        {errorMessage && (
          <p className='text-destructive text-sm'>{errorMessage}</p>
        )}

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{" "}
        <Link
          href='/signup'
          className='text-primary underline underline-offset-4'
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
