import React, { ReactNode } from "react";
import Header from "./Header/Header.tsx";

interface LayoutProps {
  children: ReactNode;
  startLoading: () => void;
  stopLoading: () => void;
}

const Layout = ({ children, startLoading, stopLoading }: LayoutProps) => {
  return (
    <>
      <Header startLoading={startLoading} stopLoading={stopLoading} />
      {children}
    </>
  );
};

export default Layout;
