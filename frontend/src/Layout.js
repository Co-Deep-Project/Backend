import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";

const Layout = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      {children}
    </HelmetProvider>
  );
};

export default Layout;