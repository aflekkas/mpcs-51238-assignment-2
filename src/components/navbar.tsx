"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Menu, Plus, Sparkles, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Film },
  { href: "/watchlist", label: "Watchlist", icon: List },
  { href: "/add", label: "Add", icon: Plus },
  { href: "/recommend", label: "Recommend", icon: Sparkles },
];

export function Navbar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-netflix-dark/95 backdrop-blur-sm border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wider text-netflix-red">
            WATCHLIST
          </span>
        </Link>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="text-white" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-netflix-dark border-white/10">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-2 pt-8">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
