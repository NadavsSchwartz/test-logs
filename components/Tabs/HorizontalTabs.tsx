import HorizontalTabItem, { HorizontalTabItemProps } from './HorizontalTabItem';

export { HorizontalTabItem };

export interface NavTabProps {
  tabs: HorizontalTabItemProps[];
  linkProps?: HorizontalTabItemProps['linkProps'];
}

const HorizontalTabs = function ({ tabs, linkProps, ...props }: NavTabProps) {
  return (
    <div className="mb-4">
      <nav
        className="no-scrollbar flex space-x-1 overflow-scroll pr-1  "
        aria-label="Tabs"
        {...props}
      >
        {tabs.map((tab, idx) => (
          <HorizontalTabItem {...tab} key={idx} {...linkProps} />
        ))}
      </nav>
    </div>
  );
};

export default HorizontalTabs;
