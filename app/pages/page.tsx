import React, { useEffect, useContext, useCallback } from "react";

import './globals.css';

export default function MyApp({ Component, pageProps }): React.JSX.Element {
  return <Component {...pageProps} />;
}