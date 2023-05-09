import { classNames } from '@/utility/className';
import Link from 'next/link';
import { createElement } from 'react';

export type ListProps = {
  roundContainer?: boolean;
} & JSX.IntrinsicElements['ul'];

export function List(props: ListProps) {
  return (
    <ul
      {...props}
      className={classNames(
        '-mx-4 sm:mx-0 sm:overflow-hidden',
        // Add rounded top and bottome if roundContainer is true
        props.roundContainer &&
          '[&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md ',
        props.className
      )}
    >
      {props.children}
    </ul>
  );
}

export type ListItemProps = {
  expanded?: boolean;
  rounded?: boolean;
  showErrorBorder?: boolean;
} & ({
  href?: never;
} & JSX.IntrinsicElements['li']);

export function ListItem(props: ListItemProps) {
  const {
    href,
    expanded,
    rounded = true,
    showErrorBorder,
    ...passThroughProps
  } = props;

  const elementType = href ? 'a' : 'li';

  const element = createElement(
    elementType,
    {
      ...passThroughProps,
      className: classNames(
        'items-center min-w-0 bg-white flex-1 flex border-neutral-200 p-4 sm:mx-0 md:border md:p-4 xl:mt-0 mt-0.5',
        expanded ? 'my-1 border' : 'border -mb-px last:mb-0',
        // Pass rounded false to not round the corners -> Usefull when used in list we can use roundedContainer to create the right design
        rounded ? 'rounded-md' : 'rounded-none',
        props.className,
        (props.onClick || href) && 'hover:bg-gray-50',
        showErrorBorder ? 'border-1 border-rose-600' : ' '
      ),
    },
    props.children
  );

  return href ? (
    <Link passHref href={href}>
      {element}
    </Link>
  ) : (
    element
  );
}

export function ListItemTitle<
  TComponent extends keyof JSX.IntrinsicElements = 'span'
>(props: JSX.IntrinsicElements[TComponent] & { component?: TComponent }) {
  const { component = 'span', ...passThroughProps } = props;

  return createElement(
    component,
    {
      ...passThroughProps,
      className: classNames(
        'text-sm font-bold text-neutral-900 truncate capitalize',
        props.className
      ),
    },
    props.children
  );
}

export function ListItemText<
  TComponent extends keyof JSX.IntrinsicElements = 'span'
>(props: JSX.IntrinsicElements[TComponent] & { component?: TComponent }) {
  const { component = 'span', ...passThroughProps } = props;

  return createElement(
    component,
    {
      ...passThroughProps,
      className: classNames('text-sm text-gray-500 truncate', props.className),
    },
    props.children
  );
}
