/* eslint-disable @typescript-eslint/no-var-requires */
const withMDX = require("@next/mdx");
const rehypePrism = require("@mapbox/rehype-prism");

const mdxConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [rehypePrism],
  },
});

const nextConfig = mdxConfig({
  pageExtensions: ["js", "jsx", "md", "mdx", "tsx", "ts"],
  exportPathMap: async (defaultPathMap) => defaultPathMap,
});

module.exports = nextConfig;
