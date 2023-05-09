import React from 'react';
import Shell from './Shell';
type LayoutProps = {
  children: React.ReactNode;
  header: React.ReactNode;
};

const Layout = ({ children, header }: LayoutProps) => {
  return (
    <Shell>
      {header}
      {children}
    </Shell>
  );
};

export default Layout;
