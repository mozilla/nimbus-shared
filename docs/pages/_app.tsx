import React from "react";
import { AppProps } from "next/app";
import "prismjs/themes/prism.css";
import cn from "classnames";
import { MDXProvider } from "@mdx-js/react";

import "../global_style.scss";
import Link from "../components/PrefixLink";
import * as anchoredHeadings from "../components/anchoredHeadings";

type NavItem = NavPageLink | NavHeading;

interface NavPageLink {
  type?: "link";
  title: string;
  href: string;
}

interface NavHeading {
  type: "heading";
  title: string;
}

// export default
const DocsApp: React.FunctionComponent<AppProps> = ({
  Component,
  pageProps,
  router,
}) => {
  const navItems: Array<NavItem> = [
    { title: "Home", href: "/" },
    { type: "heading", title: "Using this library" },
    { title: "JavaScript and TypeScript", href: "/usage/js-and-ts" },
    { title: "Python", href: "/usage/python" },
    { title: "Other environments", href: "/usage/other" },

    { type: "heading", title: "Contents" },
    { title: "Schemas", href: "/content/schemas" },
    { title: "Data", href: "/content/data" },

    { title: "Working on this library", type: "heading" },
    { title: "Setup", href: "/dev/setup" },
    { title: "Schemas", href: "/dev/schemas" },
    { title: "Data", href: "/dev/data" },
    { title: "Writing Docs", href: "/dev/docs" },
  ];

  const components = {
    // Leaving out H1, because it doesn't need to have an anchor tag added.
    h2: anchoredHeadings.H2,
    h3: anchoredHeadings.H3,
    h4: anchoredHeadings.H4,
    h5: anchoredHeadings.H5,
    h6: anchoredHeadings.H6,
  };

  return (
    <MDXProvider components={components}>
      <div className="wrapper">
        <div className="header-wrapper">
          <Link href="/">
            <a className="header">
              <img
                src={`${process.env.SITE_PREFIX}/logo.svg`}
                className="logo"
                width="40"
                height="40"
              />
              <h1>Project Nimbus Documentation</h1>
            </a>
          </Link>
        </div>
        <div className="body-wrapper">
          <nav className="site-nav">
            <ul>
              {navItems.map((item, idx) => {
                if (item.type == "heading") {
                  return <h2 key={idx}>{item.title}</h2>;
                } else {
                  return (
                    <Link href={item.href} key={idx}>
                      <li>
                        <a
                          className={cn({
                            "current-page": router.pathname == item.href,
                          })}
                        >
                          {item.title}
                        </a>
                      </li>
                    </Link>
                  );
                }
              })}
            </ul>
          </nav>
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </MDXProvider>
  );
};
export default DocsApp;
