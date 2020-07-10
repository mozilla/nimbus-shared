/* eslint-disable @typescript-eslint/no-var-requires */
const withMDX = require("@next/mdx");
const rehypePrism = require("@mapbox/rehype-prism");

const mdxConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypePrism],
  },
});

const sitePrefix = process.env.SITE_PREFIX || "";

const nextConfig = mdxConfig({
  pageExtensions: ["js", "jsx", "md", "mdx", "tsx", "ts"],
  exportPathMap: async (defaultPathMap) => defaultPathMap,
  assetPrefix: sitePrefix,
  env: {
    SITE_PREFIX: sitePrefix,
  },
});

module.exports = nextConfig;
