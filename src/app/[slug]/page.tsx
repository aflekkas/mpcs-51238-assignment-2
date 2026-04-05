"use client";

import { use } from "react";
import { useWatchlist } from "@/lib/watchlist-context";
import { ItemDetail } from "@/components/item-detail";
import { EmptyState } from "@/components/empty-state";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { getItemBySlug } = useWatchlist();
  const item = getItemBySlug(slug);

  if (!item) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <EmptyState
          icon={SearchX}
          title="Not Found"
          description="This item doesn't exist in your watchlist."
        >
          <Button
            nativeButton={false}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            render={<Link href="/" />}
          >
            Back to Watchlist
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ItemDetail item={item} />
    </div>
  );
}
