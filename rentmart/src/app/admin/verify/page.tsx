"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Trash2, X } from "lucide-react";
import {
  useAdminPendingEquipment,
  useAdminVerifyEquipment,
  useAdminRejectEquipment,
  useAdminDeleteEquipment,
} from "@/hooks/use-equipment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Equipment } from "@/lib/api/equipment";

function EquipmentCard({
  item,
  onVerify,
  onReject,
  onDelete,
  isActing,
}: {
  item: Equipment;
  onVerify: (adminNote?: string) => void;
  onReject: (adminNote: string) => void;
  onDelete: () => void;
  isActing: boolean;
}) {
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageViewerOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isImageViewerOpen]);

  return (
    <div className='overflow-hidden rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(254,247,236,0.9))] shadow-[0_24px_60px_rgba(15,23,42,0.10)] ring-1 ring-neutral-200/70'>
      <div className='grid gap-6 p-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:p-6'>
        <div className='space-y-4'>
          {item.images.length > 0 && (
            <div className='relative overflow-hidden rounded-[1.5rem] border border-neutral-200/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'>
              <button
                type='button'
                onClick={() => setIsImageViewerOpen(true)}
                className='relative block h-92 w-full cursor-zoom-in'
                aria-label={`Open ${item.name} image in full screen`}
              >
                <Image
                  src={item.images[selectedImage]}
                  alt={item.name}
                  fill
                  className='object-contain p-4'
                />
              </button>
              {item.images.length > 1 && (
                <div className='absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-3'>
                  {item.images.map((src, i) => (
                    <button
                      key={src}
                      type='button'
                      onClick={() => setSelectedImage(i)}
                      className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                        i === selectedImage
                          ? "border-white bg-white"
                          : "border-white/60 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {item.images.length > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-1'>
              {item.images.map((src, i) => (
                <button
                  key={src}
                  type='button'
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-colors ${
                    i === selectedImage
                      ? "border-neutral-900"
                      : "border-transparent"
                  }`}
                >
                  <Image src={src} alt='' fill className='object-cover' />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='space-y-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <h3 className='text-3xl font-semibold tracking-[-0.045em] text-neutral-900'>
                {item.name}
              </h3>
              <p className='mt-2 text-sm text-neutral-600'>
                {item.category.name}
                {item.location && ` · ${item.location}`}
              </p>
              <p className='mt-1 text-sm text-neutral-600'>
                Owner: {item.owner.name} ({item.owner.email})
              </p>
            </div>
            <span className='shrink-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-xl font-semibold text-neutral-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)]'>
              ₹{item.pricePerDay}/day
            </span>
          </div>

          <div className='h-px bg-neutral-200' />

          {item.description && (
            <p className='max-w-xl text-base leading-8 text-neutral-700'>
              {item.description}
            </p>
          )}

          {!showRejectForm ? (
            <div className='flex flex-wrap gap-3 pt-2'>
              <Button
                size='sm'
                disabled={isActing}
                onClick={() => onVerify()}
                className='rounded-full bg-green-700 px-5 text-white hover:bg-green-800'
              >
                <Check className='size-4' />
                {isActing ? "…" : "Approve"}
              </Button>
              <Button
                size='sm'
                variant='outline'
                disabled={isActing}
                onClick={() => setShowRejectForm(true)}
                className='rounded-full border-red-200 bg-red-50 px-5 text-red-700 hover:bg-red-100'
              >
                <X className='size-4' />
                Reject
              </Button>
              <Button
                size='sm'
                variant='outline'
                disabled={isActing}
                onClick={onDelete}
                className='rounded-full border-neutral-200 bg-white px-5 text-neutral-600 hover:bg-neutral-100 lg:ml-auto'
              >
                <Trash2 className='size-4' />
                Delete
              </Button>
            </div>
          ) : (
            <div className='space-y-3 pt-2'>
              <Textarea
                placeholder='Reason for rejection (required)'
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
              />
              <div className='flex flex-wrap gap-2'>
                <Button
                  size='sm'
                  disabled={isActing || !rejectNote.trim()}
                  onClick={() => onReject(rejectNote)}
                  className='bg-destructive hover:bg-destructive/90 text-white'
                >
                  {isActing ? "…" : "Confirm Rejection"}
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectNote("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isImageViewerOpen && item.images[selectedImage] && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsImageViewerOpen(false);
            }
          }}
          role='dialog'
          aria-modal='true'
          aria-label={`${item.name} image preview`}
        >
          <button
            type='button'
            onClick={(event) => {
              event.stopPropagation();
              setIsImageViewerOpen(false);
            }}
            className='absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80'
            aria-label='Close image preview'
          >
            <X className='size-5' />
          </button>
          <div
            className='relative w-full max-w-6xl'
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={item.images[selectedImage]}
              alt={item.name}
              width={1800}
              height={1200}
              className='h-auto max-h-[90vh] w-full object-contain'
              sizes='(max-width: 1280px) 100vw, 1280px'
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminVerifyPage() {
  const { data: pending = [], isLoading } = useAdminPendingEquipment();
  const {
    mutate: verify,
    isPending: isVerifying,
    variables: verifyingVars,
  } = useAdminVerifyEquipment();
  const {
    mutate: reject,
    isPending: isRejecting,
    variables: rejectingVars,
  } = useAdminRejectEquipment();
  const {
    mutate: remove,
    isPending: isDeleting,
    variables: deletingId,
  } = useAdminDeleteEquipment();

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-[-0.045em] text-neutral-900'>
          Verification Queue
        </h1>
        <p className='text-sm text-neutral-600'>
          Review pending equipment listings before they go live.
        </p>
      </div>

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading…</p>
      ) : pending.length === 0 ? (
        <div className='rounded-[1.8rem] border border-white/70 bg-white/80 p-10 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/70'>
          <p className='text-muted-foreground'>
            No pending listings. All caught up!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {pending.map((item) => {
            const actingOnThis =
              (isVerifying && verifyingVars?.id === item.id) ||
              (isRejecting && rejectingVars?.id === item.id) ||
              (isDeleting && deletingId === item.id);

            return (
              <EquipmentCard
                key={item.id}
                item={item}
                isActing={actingOnThis}
                onVerify={(adminNote) => verify({ id: item.id, adminNote })}
                onReject={(adminNote) => reject({ id: item.id, adminNote })}
                onDelete={() => remove(item.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
