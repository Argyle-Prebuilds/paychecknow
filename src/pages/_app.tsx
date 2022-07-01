import { ReactElement, ReactNode, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { animations } from "../animations";
import TagManager from "react-gtm-module";
import { BASE_PATH } from "consts";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

if (GTM_ID && typeof document !== "undefined") {
  TagManager.initialize({
    gtmId: GTM_ID,
  });
}

function MyApp({ Component, pageProps, router }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  const [animation] = useState(animations.fadeBack);

  return getLayout(
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>PaycheckNow</title>

        <link rel="manifest" href={BASE_PATH + "/manifest.json"} />
        <link
          rel="preload"
          href={BASE_PATH + "/fonts/CircularXXWebLight.woff2"}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={BASE_PATH + "/fonts/CircularXXWebMedium.woff2"}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={BASE_PATH + "/fonts/CircularXXWebRegular.woff2"}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          href={BASE_PATH + "/apple-icon.png"}
        ></link>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <LazyMotion features={domAnimation}>
        <AnimatePresence exitBeforeEnter={false}>
          <m.div
            key={router.route.concat(animation.name)}
            style={{
              height: "100%",
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animation.variants}
            transition={animation.transition}
          >
            <Component {...pageProps} />
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </>
  );
}

export default MyApp;
