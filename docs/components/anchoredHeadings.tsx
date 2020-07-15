import React, { ReactNode } from "react";
import cn from "classnames";

import styles from "./anchoredHeadings.module.scss";

interface AnchorProps {
  id: string | Array<string>;
  pull?: "left";
}

const Anchor: React.FunctionComponent<AnchorProps> = ({ id, pull }) => {
  let key: string;
  if (typeof id == "string") {
    key = id;
  } else {
    key = id.join("-");
  }
  key = key.toLowerCase().replace(/[_ ]/g, "-");

  return (
    <a
      className={cn(styles.anchor, { [styles.pullLeft]: pull == "left" })}
      href={`#${key}`}
      id={key}
      title="Permalink to this heading"
    >
      #
    </a>
  );
};

interface HeadingProps {
  children: ReactNode;
  headingLevel: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  anchor?: string;
  [key: string]: unknown;
}

const AnchoredHeading: React.FunctionComponent<HeadingProps> = ({
  children,
  headingLevel,
  anchor,
  ...extra
}) => {
  const anchorId =
    anchor ??
    children
      .toString()
      .toLowerCase()
      .replace(/[ _]/g, "-")
      .replace(/[^a-z0-9-]/, "");

  const { className: passedClassName, ...otherProps } = extra;
  const className = cn(passedClassName, styles.anchoredHeading);

  return React.createElement(
    headingLevel,
    { ...otherProps, className },
    <>
      <Anchor id={anchorId} pull="left"></Anchor>
      {children}
    </>,
  );
};

function _makeSpecificHeader(
  level: HeadingProps["headingLevel"],
): React.FunctionComponent<Omit<HeadingProps, "headingLevel">> {
  const rv = ({ children, ...extra }) => (
    <AnchoredHeading headingLevel={level} {...extra}>
      {children}
    </AnchoredHeading>
  );
  rv.displayName = level.toUpperCase();
  return rv;
}

export const H1 = _makeSpecificHeader("h1");
export const H2 = _makeSpecificHeader("h2");
export const H3 = _makeSpecificHeader("h3");
export const H4 = _makeSpecificHeader("h4");
export const H5 = _makeSpecificHeader("h5");
export const H6 = _makeSpecificHeader("h6");
