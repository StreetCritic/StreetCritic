"use client";

import { initAuth } from "@/auth";
import Header from "@/components/header";
import { createTheme, MantineProvider, rem } from "@mantine/core";
import { useEffect } from "react";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  headings: {
    sizes: {
      h1: {
        fontSize: rem(36),
      },
      h2: { fontSize: rem(30), lineHeight: "1.5" },
      // ...up to h6
      h6: { fontWeight: "900" },
    },
  },
  /* colors: {
   *   'streetcritic-green': [
   *     "#fcffeb",
   *     "#f8fed5",
   *     "#effea4",
   *     "#e7fe6f",
   *     "#e0fe48",
   *     "#dbfe34",
   *     "#d8fe2b",
   *     "#bee221",
   *     "#a8c916",
   *     "#90ad00"
   *   ],
   * },
   * primaryColor: "streetcritic-green", */
});

type Props = {
  children: React.ReactNode;
};

import { useDispatch } from "react-redux";

export default function App({ children }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      initAuth(dispatch);
    })();
  });
  return (
    <MantineProvider theme={theme}>
      <Header />
      {children}
    </MantineProvider>
  );
}
