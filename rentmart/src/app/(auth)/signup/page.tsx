"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignup } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLES = [
  {
    value: "RENTER" as const,
    label: "Renter",
    description: "I want to rent equipment",
  },
  {
    value: "OWNER" as const,
    label: "Owner",
    description: "I want to list my equipment",
  },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"RENTER" | "OWNER">("RENTER");
  const { mutate: signup, isPending, error } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ name, email, password, role });
  };

  const errorMessage =
    error && "response" in (error as object)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((error as any).response?.data?.message ?? error.message)
      : error?.message;

  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='space-y-1 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Create account</h1>
        <p className='text-muted-foreground text-sm'>
          Join Rentmart and start renting
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='name'>Full name</Label>
          <Input
            id='name'
            type='text'
            placeholder='Jane Doe'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete='name'
          />
        </div>

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
            placeholder='Min. 8 characters'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete='new-password'
          />
        </div>

        <div className='space-y-2'>
          <Label>I am a…</Label>
          <div className='grid grid-cols-2 gap-3'>
            {ROLES.map(({ value, label, description }) => (
              <label
                key={value}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-lg border-2 px-4 py-3 transition-colors ${
                  role === value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type='radio'
                  name='role'
                  value={value}
                  checked={role === value}
                  onChange={() => setRole(value)}
                  className='sr-only'
                />
                <span className='font-medium text-sm'>{label}</span>
                <span className='text-muted-foreground text-xs'>
                  {description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p className='text-destructive text-sm'>{errorMessage}</p>
        )}

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        Already have an account?{" "}
        <Link
          href='/login'
          className='text-primary underline underline-offset-4'
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
