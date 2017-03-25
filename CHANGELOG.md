# CHANGELOG:

## 3.0.0
- completely drop of <kebab-case> tag names conversion, both on tag definition and tag consumation.

## 2.0.0
- BREAKING CHANGE: <kebab-case> tag names rendered as <PascalCase> names only if the name
  was imported previously (meaning it's a React component). Otherwise it stays as kebab-case
  allowing non native HTML tags (e.g. WebComponents) to be added to the DOM.

## 1.0.0
- BREAKING CHANGE: drop support for `ref="string"`, use React's `refs` instead
