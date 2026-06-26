export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-sm overflow-hidden">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-2.5 flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}
