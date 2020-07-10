import React from "react";
import Link from "next/link";

interface PrefixedLinkProps {
  href: string;
  as?: string;
  children: React.ReactNode;
}

// Fixes links by prepending linkPrefix
const PrefixedLink: React.FunctionComponent<PrefixedLinkProps> = ({
  href,
  as = href,
  children,
}) => (
  <Link href={href} as={`${process.env.SITE_PREFIX}${as}`}>
    {children}
  </Link>
);

export default PrefixedLink;
