export default {
  blockquote: ignore,
  break: ignore,
  code: ignore,
  delete: ignore,
  emphasis: ignore,
  footnoteReference: ignore,
  footnote: ignore,
  heading: ignore,
  html: ignore,
  imageReference: ignore,
  image: ignore,
  inlineCode: ignore,
  linkReference: ignore,
  link: ignore,
  listItem: ignore,
  list: ignore,
  paragraph: ignore,
  root: ignore,
  strong: ignore,
  table: ignore,
  text: ignore,
  thematicBreak: ignore,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore
}

/**  Return nothing for nodes which are ignored. */
function ignore() {
  return null
}
