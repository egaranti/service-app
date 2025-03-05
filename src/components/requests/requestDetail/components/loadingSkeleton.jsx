const LoadingSkeleton = () => (
  <div className="h-full space-y-6 p-6">
    <div className="space-y-2">
      <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
      <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
    </div>
    <div className="h-32 w-full animate-pulse rounded bg-gray-200"></div>
    <div className="h-24 w-full animate-pulse rounded bg-gray-200"></div>
  </div>
);

export default LoadingSkeleton;
