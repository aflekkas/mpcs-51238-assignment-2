"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { AddItemForm } from "@/components/add-item-form";
import { PageContainer } from "@/components/page-container";

export default function AddPage() {
  return (
    <PageContainer maxWidth="2xl">
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
    </PageContainer>
  );
}
