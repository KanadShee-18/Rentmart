"use client";

import { useState } from "react";
import Image from "next/image";
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

  return (
    <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card overflow-hidden'>
      {/* Image strip */}
      {item.images.length > 0 && (
        <div className='relative w-full h-52 bg-muted'>
          <Image
            src={item.images[selectedImage]}
            alt={item.name}
            fill
            className='object-cover'
          />
          {item.images.length > 1 && (
            <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-2'>
              {item.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setSelectedImage(i)}
                  className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                    i === selectedImage
                      ? "bg-white border-white"
                      : "bg-white/40 border-white/60 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className='p-5 space-y-3'>
        {/* Meta */}
        <div>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='font-semibold text-base'>{item.name}</h3>
            <span className='text-sm font-medium text-muted-foreground shrink-0'>
              ₹{item.pricePerDay}/day
            </span>
          </div>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {item.category.name}
            {item.location && ` · ${item.location}`}
          </p>
          <p className='text-xs text-muted-foreground'>
            Owner: {item.owner.name} ({item.owner.email})
          </p>
        </div>

        {item.description && (
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {item.description}
          </p>
        )}

        {/* Thumbnail row for multi-image */}
        {item.images.length > 1 && (
          <div className='flex gap-2 flex-wrap'>
            {item.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setSelectedImage(i)}
                className={`relative w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={src} alt='' fill className='object-cover' />
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        {!showRejectForm ? (
          <div className='flex gap-2 flex-wrap pt-1'>
            <Button
              size='sm'
              disabled={isActing}
              onClick={() => onVerify()}
              className='bg-green-600 hover:bg-green-700 text-white'
            >
              {isActing ? "…" : "Approve"}
            </Button>
            <Button
              size='sm'
              variant='outline'
              disabled={isActing}
              onClick={() => setShowRejectForm(true)}
              className='text-destructive hover:bg-destructive/10'
            >
              Reject
            </Button>
            <Button
              size='sm'
              variant='outline'
              disabled={isActing}
              onClick={onDelete}
              className='text-muted-foreground ml-auto'
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className='space-y-2 pt-1'>
            <Textarea
              placeholder='Reason for rejection (required)'
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={2}
            />
            <div className='flex gap-2'>
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
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          Verification Queue
        </h1>
        <p className='text-muted-foreground text-sm mt-1'>
          Review pending equipment listings before they go live.
        </p>
      </div>

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading…</p>
      ) : pending.length === 0 ? (
        <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card p-10 text-center'>
          <p className='text-muted-foreground'>
            No pending listings. All caught up!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
