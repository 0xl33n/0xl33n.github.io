import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import ArticleImage from './ArticleImage';
import { createHeading } from './ArticleHeading';
import CodeBlock from './CodeBlock';

const COMPONENTS = {
  img: ArticleImage,
  pre: CodeBlock,
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4'),
};

/**
 * Renders the processed article tree (from lib/markdown/processMarkdown.js)
 * as React elements. Runs on the server; only images and code blocks hydrate.
 *
 * @param {import('hast').Root} tree
 */
export default function ArticleContent({ tree }) {
  return toJsxRuntime(tree, { Fragment, jsx, jsxs, components: COMPONENTS, passNode: false });
}
