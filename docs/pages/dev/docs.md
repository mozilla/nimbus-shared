# Writing Documentation

All docs are nested under the `docs/` directory, which is a separate Node project.

Edit pages in the `pages` directory. Docs should be written in either `.md` or `.mdx` format. MDX is
similar to standard Markdown, except components can be imported from other files and used as
JSX-style HTML elements. This allows for better extensibility than standard Markdown.

The base layout and site navigation are defined in `pages/_app.js`. If you add a new page make sure
to add it to the navigation in that file. Styles are defined in `global_style.css`.

## Building

If you only want to build the docs as they are, from the top level of the repository, run
`make docs`. The documentation will be built and stored in `docs/out`. The output of this is
suitable to be served using a simple HTTP server, such as `npx serve` or GitHub Pages.

However, if you plan to write and edit documentation, there are better tools available. From the
`docs/` directory, run the command `npm run dev`, which will run a development server that live
reloads most changes made to the documentation. This is the recommended way to check the
documentation written.
