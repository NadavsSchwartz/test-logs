import { classNames } from '@/utility/className';
import React from 'react';

type SkeletonBaseProps = {
  className?: string;
};

type SkeletonContainer = {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
};

type SkeletonProps<T> = {
  as: keyof JSX.IntrinsicElements | React.FC;
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  loadingClassName?: string;
} & (T extends React.FC<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : never);

const Skeleton = <T extends keyof JSX.IntrinsicElements | React.FC>({
  as,
  className = '',
  children,
  loading = false,

  /**
   * Classes that you need only in loading state
   */
  loadingClassName = '',
  ...rest
}: SkeletonProps<T>) => {
  loading = false || loading;
  const Component = as;
  return (
    <Component
      className={classNames(
        loading
          ? classNames(
              'font-size-0 animate-pulse rounded-md bg-gray-300 text-transparent',
              loadingClassName
            )
          : '',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
const SkeletonAvatar: React.FC<SkeletonBaseProps> = ({ className }) => {
  return (
    <div
      className={classNames(`mt-1 rounded-full bg-gray-200 mr-2`, className)}
    />
  );
};
const SkeletonText: React.FC<SkeletonBaseProps & { invisible?: boolean }> = ({
  className = '',
  invisible = false,
}) => {
  return (
    <span
      className={classNames(
        `font-size-0 inline-block animate-pulse rounded-md bg-gray-300 empty:before:inline-block empty:before:content-['']`,
        className,
        invisible ? 'invisible' : ''
      )}
    />
  );
};
const SkeletonContainer: React.FC<SkeletonContainer> = ({
  children,
  as,
  className,
}) => {
  const Component = as || 'div';
  return (
    <Component className={classNames('animate-pulse', className)}>
      {children}
    </Component>
  );
};

const SkeletonButton: React.FC<SkeletonBaseProps> = ({ className }) => {
  return (
    <SkeletonContainer>
      <div className={classNames(`rounded-md bg-gray-200`, className)} />
    </SkeletonContainer>
  );
};

export {
  Skeleton,
  SkeletonText,
  SkeletonContainer,
  SkeletonButton,
  SkeletonAvatar,
};
