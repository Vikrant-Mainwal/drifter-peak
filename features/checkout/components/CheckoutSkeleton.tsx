import { Skeleton } from "@/components/ui/Skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:grid md:grid-cols-[1fr_380px] md:gap-8 md:px-6">
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
      <div className="mt-4 md:mt-0">
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </div>
  );
}
