"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { AddItemForm } from "@/components/add-item-form";

export default function AddPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6">
        <BlurFade delay={0.05}>
          <TextAnimate
            as="h1"
            animation="blurInUp"
            by="word"
            className="text-3xl font-bold text-white"
            once
          >
            Add to Watchlist
          </TextAnimate>
          <p className="text-muted-foreground mt-1">
            Add a movie or show to track
          </p>
        </BlurFade>
        <BlurFade delay={0.15} offset={12}>
          <AddItemForm />
        </BlurFade>
      </div>
    </div>
  );
}
