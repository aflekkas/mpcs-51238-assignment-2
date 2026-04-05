import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: "2xl" | "7xl";
  className?: string;
}

export function PageContainer({
  children,
  maxWidth = "7xl",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12",
        maxWidth === "2xl" ? "max-w-2xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}
