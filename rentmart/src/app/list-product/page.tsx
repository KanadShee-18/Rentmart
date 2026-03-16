"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCategories } from "@/hooks/use-category";
import { useCreateEquipment, useMyListings } from "@/hooks/use-equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUS_STYLES: Record<string, string> = {
  PENDING:
    "border-yellow-400/40 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400",
  VERIFIED:
    "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400",
  REJECTED: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
};

function getCategorySummary(description?: string) {
  if (!description) return "No description available.";

  const match = description.match(/examples?:\s*(.*)$/i);
  const trimmedSummary = match?.[1]?.trim();

  return trimmedSummary || "No description available.";
}

export default function ListProductPage() {
  const router = useRouter();
  const { user, isLoading, isOwner, isAuthenticated } = useAuth();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: myListings = [] } = useMyListings();
  const {
    mutate: createEquipment,
    isPending,
    error,
    isSuccess,
    reset,
  } = useCreateEquipment();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );

  // Access guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && !isOwner) router.replace("/");
  }, [isLoading, isAuthenticated, isOwner, router]);

  useEffect(() => {
    if (!isCategoryMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isCategoryMenuOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(previews[idx]);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    createEquipment(
      {
        name,
        description: description || undefined,
        pricePerDay: parseFloat(pricePerDay),
        location: location || undefined,
        categoryId,
        images,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setPricePerDay("");
          setLocation("");
          setCategoryId("");
          setIsCategoryMenuOpen(false);
          setImages([]);
          setPreviews([]);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  };

  const serverError =
    error && "response" in (error as object)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((error as any).response?.data?.message ?? error.message)
      : error?.message;

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground text-sm'>Loading…</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-20 pb-12 px-4'>
      <div className='max-w-2xl mx-auto space-y-8'>
        {/* ── Submit form ── */}
        <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card text-card-foreground p-6 space-y-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              List Your Equipment
            </h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Fill in the details. Your listing will be reviewed by an admin
              before going live.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name */}
            <div className='space-y-1.5'>
              <Label htmlFor='eq-name'>Equipment Name</Label>
              <Input
                id='eq-name'
                placeholder='e.g. Canon EOS R5 Camera'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className='space-y-1.5'>
              <Label htmlFor='eq-category-trigger'>Category</Label>
              <div className='relative' ref={categoryMenuRef}>
                <button
                  id='eq-category-trigger'
                  type='button'
                  aria-haspopup='listbox'
                  aria-expanded={isCategoryMenuOpen}
                  aria-required='true'
                  onClick={() =>
                    !categoriesLoading &&
                    categories.length > 0 &&
                    setIsCategoryMenuOpen((open) => !open)
                  }
                  className='flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
                  disabled={categoriesLoading || categories.length === 0}
                >
                  {selectedCategory ? (
                    <div className='grid min-w-0 flex-1 grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-3'>
                      <div className='relative h-12 w-12 overflow-hidden rounded-md border bg-muted'>
                        {selectedCategory.imageUrl ? (
                          <Image
                            src={selectedCategory.imageUrl}
                            alt={selectedCategory.name}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-[10px] text-muted-foreground'>
                            No image
                          </div>
                        )}
                      </div>
                      <div className='min-w-0'>
                        <p className='truncate text-sm font-medium text-foreground'>
                          {selectedCategory.name}
                        </p>
                        <p className='line-clamp-2 text-xs text-muted-foreground'>
                          {getCategorySummary(selectedCategory.description)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className='text-sm text-muted-foreground'>
                      {categoriesLoading
                        ? "Loading categories…"
                        : categories.length === 0
                          ? "No categories available"
                          : "Select a category"}
                    </span>
                  )}
                  <ChevronDown
                    className={`ml-3 size-4 shrink-0 text-muted-foreground transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoryMenuOpen && categories.length > 0 && (
                  <div
                    role='listbox'
                    aria-label='Category options'
                    className='absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border bg-popover p-2 shadow-lg'
                  >
                    {categories.map((category) => {
                      const isSelected = category.id === categoryId;

                      return (
                        <button
                          key={category.id}
                          type='button'
                          role='option'
                          aria-selected={isSelected}
                          onClick={() => {
                            setCategoryId(category.id);
                            setIsCategoryMenuOpen(false);
                          }}
                          className={`grid w-full grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${isSelected ? "bg-muted" : "hover:bg-muted/70"}`}
                        >
                          <div className='relative h-12 w-12 overflow-hidden rounded-md border bg-muted'>
                            {category.imageUrl ? (
                              <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                className='object-cover'
                              />
                            ) : (
                              <div className='flex h-full w-full items-center justify-center text-[10px] text-muted-foreground'>
                                No image
                              </div>
                            )}
                          </div>
                          <div className='min-w-0'>
                            <p className='truncate text-sm font-medium text-foreground'>
                              {category.name}
                            </p>
                            <p className='line-clamp-2 text-xs text-muted-foreground'>
                              {getCategorySummary(category.description)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className='space-y-1.5'>
              <Label htmlFor='eq-price'>Price per Day (₹)</Label>
              <Input
                id='eq-price'
                type='number'
                placeholder='e.g. 500'
                min='1'
                step='0.01'
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />
            </div>

            {/* Location */}
            <div className='space-y-1.5'>
              <Label htmlFor='eq-location'>Location</Label>
              <Input
                id='eq-location'
                placeholder='City or area'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className='space-y-1.5'>
              <Label htmlFor='eq-desc'>Description</Label>
              <Textarea
                id='eq-desc'
                placeholder='Describe your equipment, condition, accessories included…'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Images */}
            <div className='space-y-2'>
              <Label>Images (up to 5)</Label>
              {previews.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {previews.map((src, idx) => (
                    <div
                      key={idx}
                      className='relative w-20 h-20 rounded-lg overflow-hidden border'
                    >
                      <Image src={src} alt='' fill className='object-cover' />
                      <button
                        type='button'
                        onClick={() => removeImage(idx)}
                        className='absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 5 && (
                <div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/jpeg,image/png,image/jpg'
                    multiple
                    className='hidden'
                    onChange={handleFileChange}
                    id='eq-images'
                  />
                  <label
                    htmlFor='eq-images'
                    className='inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors'
                  >
                    + Add images
                  </label>
                </div>
              )}
            </div>

            {serverError && (
              <p className='text-destructive text-sm'>{serverError}</p>
            )}
            {isSuccess && (
              <p className='text-green-600 dark:text-green-400 text-sm'>
                Listing submitted! It will appear once approved by an admin.
              </p>
            )}

            <Button type='submit' disabled={isPending || images.length === 0}>
              {isPending ? "Submitting…" : "Submit for Review"}
            </Button>
          </form>
        </div>

        {/* ── My listings ── */}
        {myListings.length > 0 && (
          <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card text-card-foreground p-6 space-y-4'>
            <h2 className='text-lg font-semibold'>My Listings</h2>
            <div className='space-y-3'>
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className='flex items-start gap-3 rounded-xl border p-3'
                >
                  {item.images[0] && (
                    <div className='relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border'>
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{item.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.category.name}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      ₹{item.pricePerDay}/day
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium border rounded-full px-2 py-0.5 shrink-0 ${STATUS_STYLES[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
