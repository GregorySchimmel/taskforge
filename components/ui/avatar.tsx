import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    />
  );
}

export function AvatarImage({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  if (!src) return null;
  return <img src={src} alt={alt ?? ""} className={cn("aspect-square h-full w-full object-cover", className)} />;
}

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white", className)}>
      {children}
    </div>
  );
}