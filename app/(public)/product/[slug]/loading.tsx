import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image gallery skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
            <Skeleton className="h-16 w-16" />
          </div>
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-12 w-full" /> {/* variant selector */}
          <Skeleton className="h-12 w-full" /> {/* add to cart button */}
        </div>
      </div>
    </div>
  );
}