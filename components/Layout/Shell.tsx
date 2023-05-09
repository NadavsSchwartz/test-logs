import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { Fragment, useEffect, useState } from 'react';

import { classNames } from '@/utility/className';
import { APP_NAME, WEBAPP_URL } from 'lib/constants';
import {
  FiArrowLeft,
  FiLogOut,
  FiMoreVertical,
  FiZap
} from 'react-icons/fi';
import { ClientUser } from 'types/models/User';
import { Button } from '../Button';
import CustomHead from '../CustomHead';
import Dropdown, {
  DropdownItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger
} from '../Dropdown';
import ErrorBoundary from '../Error/ErrorBoundary';
import { SkeletonText } from '../Loading/Skeleton';
import { Logo, LogoIcon } from '../icons';
export type SVGComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement>
>;

function useRedirectToLoginIfUnauthenticated(isPublic = false) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  useEffect(() => {
    if (isPublic) {
      return;
    }

    if (!loading && !session) {
      router.replace({
        pathname: '/auth/signin',
        query: {
          callbackUrl: `${WEBAPP_URL}${location.pathname}${location.search}`,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session, isPublic]);

  return {
    loading: loading && !session,
    session,
  };
}

const Layout = (props: LayoutProps) => {
  const pageTitle =
    typeof props.heading === 'string' && !props.title
      ? props.heading
      : props.title;

  return (
    <>
      {!props.withoutSeo && (
        <CustomHead
          title={pageTitle ?? APP_NAME}
          description={props.subtitle ? props.subtitle?.toString() : ''}
        />
      )}

      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1" data-testid="sidebar">
          {props.SidebarContainer || <SideBarContainer />}
          <div className="flex w-0 flex-1 flex-col">
            <MainContainer {...props} />
          </div>
        </div>
      </div>
    </>
  );
};

type DrawerState = [
  isOpen: boolean,
  setDrawerOpen: Dispatch<SetStateAction<boolean>>
];

type LayoutProps = {
  centered?: boolean;
  title?: string;
  heading?: ReactNode;
  subtitle?: ReactNode;
  headerClassName?: string;
  children: ReactNode;
  CTA?: ReactNode;
  large?: boolean;
  MobileNavigationContainer?: ReactNode;
  SidebarContainer?: ReactNode;
  TopNavContainer?: ReactNode;
  drawerState?: DrawerState;
  HeadingLeftIcon?: ReactNode;
  backPath?: string | boolean; // renders back button to specified path
  // use when content needs to expand with flex
  flexChildrenContainer?: boolean;
  isPublic?: boolean;
  withoutMain?: boolean;
  // Gives you the option to skip HeadSEO and render your own.
  withoutSeo?: boolean;
  // Gives the ability to include actions to the right of the heading
  actions?: JSX.Element;
  smallHeading?: boolean;
};

export default function Shell(props: LayoutProps) {
  // if a page is unauthed and isPublic is true, the redirect does not happen.
  useRedirectToLoginIfUnauthenticated(props.isPublic);
  // shouldShowUniversalLink =
  //   (useWindowSize()?.width as any) > 1536 ? true : false;

  return <Layout {...props} />;
}

function UserDropdown({ small }: { small?: boolean }) {
  const { data: session } = useSession();
  const user = session?.user as ClientUser;
  const [menuOpen, setMenuOpen] = useState(false);
  // Prevent rendering dropdown if user isn't available.
  // We don't want to show nameless user.
  if (!user) {
    return null;
  }
  const generateValidAvatarUrl = (email: string) => {
    const url = new URL(`${WEBAPP_URL}/api/users/avatar`);
    url.searchParams.set('email', email);
    return url.toString();
  };
  return (
    <Dropdown open={menuOpen}>
      <div>
        <DropdownMenuTrigger
          asChild
          onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
        >
          <button className="radix-state-open:bg-gray-200 group flex w-full cursor-pointer appearance-none items-center rounded-md p-2 text-left outline-none hover:bg-gray-200 focus:outline-none focus:ring-0 md:rounded-none lg:rounded mx-0 px-1 lg:pl-2">
            <span
              className={classNames(
                small ? 'h-6 w-6 md:ml-3' : 'h-8 w-8 mr-2',
                'relative flex-shrink-0 rounded-full bg-gray-300 '
              )}
            >
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="rounded-full"
                  src={generateValidAvatarUrl(
                    user.email ? user.email : 'test@something.com'
                  )}
                  alt={user.email || 'Nameless User'}
                />
              }

              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </span>
            {!small && (
              <span className="flex flex-grow items-center truncate">
                <span className="flex-grow truncate text-sm">
                  <span className="mb-1 block truncate font-medium leading-none text-gray-900">
                    {user.firstName + ' ' + user.lastName || 'Nameless User'}
                  </span>
                  <span className="block truncate lowercase font-normal leading-none text-gray-600">
                    {user.role}
                  </span>
                </span>
                <FiMoreVertical
                  className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-400  "
                  aria-hidden="true"
                />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuPortal>
        <DropdownMenuContent
          onInteractOutside={() => {
            setMenuOpen(false);
          }}
          className="overflow-hidden rounded-md"
        >
          <>


            <DropdownMenuItem>
              <DropdownItem
                type="button"
                StartIcon={(props) => (
                  <FiLogOut aria-hidden="true" {...props} />
                )}
                onClick={() => signOut()}
              >
                {'Sign Out'}
              </DropdownItem>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </Dropdown>
  );
}

export type NavigationItemType = {
  name: string;
  href: string;
  badge?: React.ReactNode;
  icon?: SVGComponent;
  child?: NavigationItemType[];
  pro?: true;
  onlyMobile?: boolean;
  onlyDesktop?: boolean;
  loading?: boolean;
  isCurrent?: ({
    item,
    isChild,
    router,
  }: {
    item: NavigationItemType;
    isChild?: boolean;
    router: NextRouter;
  }) => boolean;
};

const navigation: NavigationItemType[] = [


  {
    name: 'Assignments',
    href: '/assignments',
    icon: FiZap,
  },

];

// We create all needed navigation items for the different use cases
const { desktopNavigationItems, mobileNavigationBottomItems } =
  navigation.reduce<Record<string, NavigationItemType[]>>(
    (items, item) => {
      // Items for mobile bottom navigation
      if (!item.onlyDesktop) items.mobileNavigationBottomItems.push(item);
      items.desktopNavigationItems.push(item);

      return items;
    },
    {
      desktopNavigationItems: [],
      mobileNavigationBottomItems: [],
    }
  );

const Navigation = () => {
  const { status } = useSession();
  if (status === 'loading')
    return (
      <nav className="mt-14 flex-1 md:px-2 lg:mt-6 lg:px-0">
        <div className="flex py-2 px-3">
          <SkeletonText className="h-3 w-40 py-2 px-3" />
        </div>
        <div className=" flex py-2 px-3">
          <SkeletonText className="h-3 w-40 py-2 px-3" />
        </div>{' '}
        <div className=" flex py-2 px-3">
          <SkeletonText className="h-3 w-40 py-2 px-3" />
        </div>{' '}
        <div className=" flex py-2 px-3">
          <SkeletonText className="h-3 w-40 py-2 px-3" />
        </div>{' '}
        <div className="flex py-2 px-3">
          <SkeletonText className="h-3 w-40 py-2 px-3" />
        </div>
      </nav>
    );

  return (
    <nav className="mt-2 flex-1 md:px-2 lg:mt-12 lg:px-0">
      {desktopNavigationItems.map((item) => (
        <NavigationItem key={item.name} item={item} />
      ))}
    </nav>
  );
};
const requiredCredentialNavigationItemsTeacher = ['Tasks'];

function useShouldDisplayNavigationItem(item: NavigationItemType) {
  const { status, data } = useSession();
  if (status !== 'authenticated') return null;
  const user = data?.user as ClientUser;
  // if user.role is not teacher, don't display the navigation items that require teacher credential

  if (user?.role === 'STUDENT') {
    return !requiredCredentialNavigationItemsTeacher.includes(item.name);
  }
  return true;
}
const defaultIsCurrent: NavigationItemType['isCurrent'] = ({
  isChild,
  item,
  router,
}) => {
  return isChild
    ? item.href === router.asPath
    : router.asPath.startsWith(item.href);
};

const NavigationItem: React.FC<{
  index?: number;
  item: NavigationItemType;
  isChild?: boolean;
  loading?: boolean;
}> = (props) => {
  const { item, isChild } = props;
  const router = useRouter();
  const isCurrent: NavigationItemType['isCurrent'] =
    item.isCurrent || defaultIsCurrent;
  const current = isCurrent({ isChild: !!isChild, item, router });
  const shouldDisplayNavigationItem = useShouldDisplayNavigationItem(
    props.item
  );
  if (!shouldDisplayNavigationItem) return null;

  return (
    <Fragment>
      <Link
        href={item.href}
        aria-label={item.name}
        className={classNames(
          "group flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 [&[aria-current='page']]:bg-gray-200 [&[aria-current='page']]:hover:text-gray-900",
          isChild
            ? `[&[aria-current='page']]:text-brand-900 hidden h-8 pl-16 lg:flex lg:pl-11 [&[aria-current='page']]:bg-transparent ${props.index === 0 ? 'mt-0' : 'mt-px'
            }`
            : "[&[aria-current='page']]:text-brand-900 mt-0.5 text-sm"
        )}
        aria-current={current ? 'page' : undefined}
      >
        {item.icon && (
          <item.icon
            className="h-4 w-4 flex-shrink-0 text-gray-500  mr-2  [&[aria-current='page']]:text-inherit"
            aria-hidden="true"
            aria-current={current ? 'page' : undefined}
          />
        )}

        {!props.loading ? (
          <span className="hidden w-full justify-between lg:flex">
            <div className="flex">{item.name}</div>
            {item.badge && item.badge}
          </span>
        ) : (
          <SkeletonText className="h-3 w-32" />
        )}
      </Link>
      {item.child &&
        isCurrent({ router, isChild, item }) &&
        item.child.map((item, index) => (
          <NavigationItem
            index={index}
            key={item.name}
            item={item}
            isChild
            loading={props.loading}
          />
        ))}
    </Fragment>
  );
};

function MobileNavigationContainer() {
  const { status } = useSession();
  if (status !== 'authenticated') return null;

  return <MobileNavigation />;
}

const MobileNavigation = () => {
  return (
    <>
      <nav
        className={classNames(
          'pwa:pb-2.5 fixed bottom-0 z-30 -mx-2 flex w-full border border-t border-gray-200 bg-gray-50 bg-opacity-40 px-1 shadow backdrop-blur-md md:hidden'
        )}
      >
        {mobileNavigationBottomItems.map((item) => (
          <MobileNavigationItem key={item.name} item={item} />
        ))}
      </nav>
      {/* add padding to content for mobile navigation*/}
      <div className="block pt-12 md:hidden" />
    </>
  );
};

const MobileNavigationItem: React.FC<{
  item: NavigationItemType;
  isChild?: boolean;
}> = (props) => {
  const { item, isChild } = props;
  const router = useRouter();

  const isCurrent: NavigationItemType['isCurrent'] =
    item.isCurrent || defaultIsCurrent;
  const current = isCurrent({ isChild: !!isChild, item, router });
  const shouldDisplayNavigationItem = useShouldDisplayNavigationItem(
    props.item
  );
  if (!shouldDisplayNavigationItem) return null;

  return (
    <Link
      key={item.name}
      href={item.href}
      className="relative my-2 min-w-0 flex-1 overflow-hidden rounded-md !bg-transparent p-1 text-center text-xs font-medium text-gray-400 hover:text-gray-700 focus:z-10 sm:text-sm [&[aria-current='page']]:text-gray-900"
      aria-current={current ? 'page' : undefined}
    >
      {item.badge && <div className="absolute right-1 top-1">{item.badge}</div>}
      {item.icon && (
        <item.icon
          className="mx-auto mb-1 block h-5 w-5 flex-shrink-0 text-center text-inherit [&[aria-current='page']]:text-gray-900"
          aria-hidden="true"
          aria-current={current ? 'page' : undefined}
        />
      )}

      <span className="block truncate">{item?.name}</span>
    </Link>
  );
};

function SideBarContainer() {
  const { status } = useSession();

  // Make sure that Sidebar is rendered optimistically so that a refresh of pages when logged in have SideBar from the beginning.
  // This improves the experience of refresh on app store pages(when logged in) which are SSG.
  // Though when logged out, app store pages would temporarily show SideBar until session status is confirmed.
  if (status !== 'loading' && status !== 'authenticated') return null;
  return <SideBar />;
}

function SideBar() {
  return (
    <div className="relative">
      <aside className="desktop-transparent top-0 hidden h-full max-h-screen w-14 flex-col overflow-y-auto overflow-x-hidden border-r border-gray-100 bg-gray-50 md:sticky md:flex lg:w-48 lg:px-3">
        <div className="flex h-full flex-col justify-between py-3 lg:pt-4">
          <header className="items-center justify-between md:hidden lg:flex">
            <Link href="/">
              <Logo height={50} width={170} />
            </Link>
          </header>

          {/* logo icon for tablet */}
          <Link href="/" className="text-center md:inline lg:hidden mx-auto">
            <LogoIcon height={50} width={50} />
          </Link>

          <Navigation />
        </div>

        <div>
          <div data-testid="user-dropdown-trigger">
            <span className="hidden lg:inline">
              <UserDropdown />
            </span>
            <span className="hidden md:inline lg:hidden">
              <UserDropdown small />
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function ShellMain(props: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <div
        className={classNames(
          'flex items-center md:mt-0 md:mb-6',
          props.smallHeading ? 'lg:mb-7' : 'lg:mb-8'
        )}
      >
        {!!props.backPath && (
          <Button
            size="sm"
            color="minimal"
            onClick={() =>
              typeof props.backPath === 'string'
                ? router.push(props.backPath as string)
                : router.back()
            }
            StartIcon={FiArrowLeft}
            aria-label="Go Back"
            className="rounded-md  mr-2 "
          />
        )}
        {props.heading && (
          <header
            data-testid="section-header"
            className={classNames(
              props.large && 'py-6',
              'flex w-full max-w-full items-center p-1'
            )}
          >
            {props.HeadingLeftIcon && (
              <div className=" mr-4">{props.HeadingLeftIcon}</div>
            )}
            <div
              className={classNames('w-full mr-1 block', props.headerClassName)}
            >
              {props.heading && (
                <>
                  <h1
                    className={classNames(
                      'max-w-60 md:max-w-80 text-xl font-semibold tracking-wide text-black md:block xl:max-w-full',
                      props.smallHeading ? 'text-base' : 'text-xl'
                    )}
                  >
                    {props?.heading}
                  </h1>
                </>
              )}
              {props.subtitle && (
                <div className="text-sm text-gray-500 md:block">
                  {props?.subtitle}
                </div>
              )}
            </div>
            {props.CTA && (
              <div
                className={classNames(
                  props.backPath
                    ? 'relative'
                    : 'pwa:bottom-24 fixed bottom-20 z-40 right-4 md:z-auto md:right-0 md:left-0',
                  'invisible xs:visible relative bottom-auto right-auto'
                )}
              >
                {props.CTA}
              </div>
            )}
            {props.actions && props.actions}
          </header>
        )}
      </div>
      <div
        className={classNames(
          props.flexChildrenContainer && 'flex flex-1 flex-col'
        )}
      >
        {props.children}
      </div>
    </>
  );
}

function MainContainer({
  MobileNavigationContainer: MobileNavigationContainerProp = (
    <MobileNavigationContainer />
  ),
  TopNavContainer: TopNavContainerProp = <TopNavContainer />,
  ...props
}: LayoutProps) {
  return (
    <main className="relative z-0 flex-1 bg-white focus:outline-none">
      {/* show top navigation for md and smaller (tablet and phones) */}
      {TopNavContainerProp}
      <div className="max-w-full py-6 px-2">
        <ErrorBoundary>
          {!props.withoutMain ? (
            <ShellMain {...props}>{props.children}</ShellMain>
          ) : (
            props.children
          )}
        </ErrorBoundary>
        {/* show bottom navigation for md and smaller (tablet and phones) on pages where back button doesn't exist */}
        {!props.backPath ? MobileNavigationContainerProp : null}
      </div>
    </main>
  );
}

function TopNavContainer() {
  const { status } = useSession();
  if (status !== 'authenticated') return null;
  return <TopNav />;
}

function TopNav() {
  return (
    <>
      <nav className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-gray-200 bg-gray-50 bg-opacity-50 py-1.5 px-4 backdrop-blur-lg  md:hidden">
        <Link href="/">
          <Logo width={150} height={50} />
        </Link>
        <div className="flex items-center gap-2 self-center">
          <UserDropdown small />
        </div>
      </nav>
    </>
  );
}
