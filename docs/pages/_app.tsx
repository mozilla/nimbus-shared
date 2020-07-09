import React from "react";
import { AppProps } from "next/app";
import "prismjs/themes/prism.css";
import cn from "classnames";

import "../global_style.scss";
import Link from "../components/PrefixLink";

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
const DocsApp: React.FunctionComponent<AppProps> = ({ Component, pageProps, router }) => {
  const navItems: Array<NavItem> = [
    { title: "Home", href: "/" },
    { type: "heading", title: "Using this library" },
    { title: "JavaScript and TypeScript", href: "/usage/js-and-ts" },
    { title: "Python", href: "/usage/python" },
    { title: "Other environments", href: "/usage/other" },
    { title: "Working on this library", type: "heading" },
    { title: "Setup", href: "/dev/setup" },
    { title: "Schemas", href: "/dev/schemas" },
    { title: "Data", href: "/dev/data" },
    { title: "Writing Docs", href: "/dev/docs" },
  ];

  return (
    <>
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
              {navItems.map((item) => {
                if (item.type == "heading") {
                  return <h2>{item.title}</h2>;
                } else {
                  return (
                    <Link href={item.href} key={item.href}>
                      <li>
                        <a className={cn({ "current-page": router.pathname == item.href })}>
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
    </>
  );
};
export default DocsApp;
