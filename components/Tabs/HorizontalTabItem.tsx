import { classNames } from '@/utility/className';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentProps } from 'react';

export type HorizontalTabItemProps = {
  name: string;
  disabled?: boolean;
  className?: string;
  href: string;
  linkProps?: Omit<ComponentProps<typeof Link>, 'href'>;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const HorizontalTabItem = function ({
  name,
  href,
  linkProps,

  ...props
}: HorizontalTabItemProps) {
  const { asPath } = useRouter();
  const isCurrent = asPath.startsWith(href);

  return (
    <Link
      key={name}
      href={href}
      {...linkProps}
      className={classNames(
        isCurrent
          ? "hover:bg-gray-50 group-hover:text-gray-700 [&[aria-current='page']]:bg-gray-200 [&[aria-current='page']]:text-brand-900 [&[aria-current='page']]:hover:text-gray-900"
          : '  text-gray-500 hover:bg-gray-50 hover:text-gray-700 ',
        'mb-2 inline-flex items-center justify-center whitespace-nowrap rounded-md py-[10px] px-2 text-sm font-medium leading-4 md:mb-0 capitalize',
        props.disabled && 'pointer-events-none !opacity-30',
        props.className
      )}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {props.icon && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        <props.icon
          className={classNames(
            isCurrent
              ? "hover:bg-gray-50 group-hover:text-gray-700 [&[aria-current='page']]:bg-gray-200 [&[aria-current='page']]:text-brand-900 [&[aria-current='page']]:hover:text-gray-900"
              : 'text-gray-400 group-hover:text-gray-500',
            '-ml-0.5 hidden h-4 w-4 mr-2 sm:inline-block'
          )}
          aria-hidden="true"
        />
      )}
      {name}
    </Link>
  );
};

export default HorizontalTabItem;
