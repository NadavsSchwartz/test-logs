import { SkeletonText } from '@/components/Loading/Skeleton';

export const HeadingSkeleton = () => (
  <div className="pb-1">
    <SkeletonText className="h-6 w-40 " />
  </div>
);

export const SubtitleSkeleton = () => (
  <>
    <div className="flex flex-col gap-1 pb-3">
      <SkeletonText className="h-4 w-32 " />
      <SkeletonText className="h-4 w-32 " />
      <SkeletonText className="h-4 w-32 " />
      <SkeletonText className="h-4 w-32 " />
    </div>
    <div className="flex flex-col gap-1">
      <SkeletonText className="h-6 w-32 " />
      <SkeletonText className="h-4 w-full " />
      <SkeletonText className="h-4 w-full " />
    </div>
  </>
);
