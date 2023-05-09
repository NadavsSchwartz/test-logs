import { classNames } from '@/utility/className';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentProps, Fragment } from 'react';
import { FiChevronRight, FiExternalLink } from 'react-icons/fi';
import { Skeleton } from '../Loading/Skeleton';

export type VerticalTabItemProps = {
  avatar?: string;
  name: string;
  info?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  children?: VerticalTabItemProps[];
  textClassNames?: string;
  className?: string;
  isChild?: boolean;
  hidden?: boolean;
  disableChevron?: boolean;
  href: string;
  isExternalLink?: boolean;
  linkProps?: Omit<ComponentProps<typeof Link>, 'href'>;
};

const VerticalTabItem = function ({
  name,
  href,
  info,
  isChild,
  disableChevron,
  linkProps,
  ...props
}: VerticalTabItemProps) {
  const { asPath } = useRouter();
  const isCurrent = asPath.startsWith(href);

  return (
    <Fragment key={name}>
      {!props.hidden && (
        <>
          <Link
            key={name}
            href={href}
            {...linkProps}
            target={props.isExternalLink ? '_blank' : '_self'}
            className={classNames(
              props.textClassNames ||
                'text-sm font-medium leading-none text-gray-600',
              "min-h-9 group flex w-52 flex-row items-center rounded-md px-3 py-[10px] hover:bg-gray-50 group-hover:text-gray-700 [&[aria-current='page']]:bg-gray-200 [&[aria-current='page']]:text-brand-900 [&[aria-current='page']]:hover:text-gray-900",
              props.disabled && 'pointer-events-none !opacity-30',
              (isChild || !props.icon) && 'ml-7 mr-5 w-auto',
              'h-9',
              props.className
            )}
            data-testid={`vertical-tab-${name}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {props.icon && (
              <props.icon className="mr-[10px] h-[16px] w-[16px] stroke-[2px] md:mt-0" />
            )}
            <div>
              <span className="flex items-center space-x-2">
                <Skeleton
                  title={name}
                  as="p"
                  className="max-w-36 truncate py-1"
                >
                  {name}
                </Skeleton>
                {props.isExternalLink ? <FiExternalLink /> : null}
              </span>
              {info && (
                <Skeleton as="p" className="mt-1 text-xs font-normal">
                  {info}a
                </Skeleton>
              )}
            </div>
            {!disableChevron && isCurrent && (
              <div className="ml-auto self-center">
                <FiChevronRight
                  width={20}
                  height={20}
                  className="h-auto w-[20px] stroke-[1.5px] text-gray-700"
                />
              </div>
            )}
          </Link>
          {props.children?.map((child) => (
            <VerticalTabItem key={child.name} {...child} isChild />
          ))}
        </>
      )}
    </Fragment>
  );
};

export default VerticalTabItem;
