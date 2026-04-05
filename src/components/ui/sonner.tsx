"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon, PartyPopper, Sparkles } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-center"
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <PartyPopper className="size-4 text-green-400" />
        ),
        info: (
          <Sparkles className="size-4 text-blue-400" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-400" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-400" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-netflix-red" />
        ),
      }}
      style={
        {
          "--normal-bg": "oklch(0.18 0 0)",
          "--normal-text": "oklch(0.97 0 0)",
          "--normal-border": "oklch(1 0 0 / 12%)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !border-white/10 !shadow-xl !shadow-black/40 !backdrop-blur-sm",
          title: "!font-semibold",
          description: "!text-white/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
