# Rioct

Rioct is a HTML templating language for [React](https://facebook.github.io/react/),
built on top of [react-templates](https://github.com/wix/react-templates), of which it
extends the syntax and adds new features.

# Notable features

## Compared to [react-templates](https://github.com/wix/react-templates)

- easier syntax: `if`, `each` without the `rt-` prefix
- develop mode: a lot easier to debug with errors no longer "swallowed" by React. Expressions are checked for type integrity.
- accepts `.html` file extension (so to make HTML syntax highlight work in editors)
- can use `<kebab-case>` tag identifiers (turned into PascalCase)
- can make use of the `<style>` tag
- can use lower case names for events or attributes (e.g. `onclick` instead of `onClick`)
- automatically binds event handlers to `this`
- content yielding with `<yield />`, `<yield from=""/>` and `<yield to=""/>`
- `show` and `hide` attributes
- unified `class` attributes
- supports custom brackets like `{{ }}` or `{% %}`.

## Compared to [Riot](http://riotjs.com/)

- templates are compiled to pure JavaScript code, no runtime is required other than React
- early catching of errors with expressions syntax checked at compile time
- expressions are statically compiled, no bracket processing of any kind at runtime
- can extend native elements (`li`, `input`, etc..) with the `is` keyword
- has variable scoping `scope=`
- element is bound to `this` even in child nodes
- expressions need explicit `this`, no ambiguity between `window` and local
- no `parent.parent` hell
- no node inheritances in loops
- true `<virtual>` node (does not create an element)
- true `if` attribute (does not create child element when `false`)
- import dependencies with `<import>` tag
- builtin dynamic styles, can simulate scoped sytles with `_this_`
- byte-saving option that normalizes Html Whitespaces

# List of npm packages

- `rioct-cli` is the command line compiler tool that turns `.html` templates into actual React JavaScript code.
- [`rioct`](https://github.com/nippur72/rioct) is a TypeScript-friendly library to help consume compiled templates. The package is optional
and it's needed only for some advanced features. To use this package, TypeScript is not required (but recommended).
- [`rioct-loader`](https://github.com/nippur72/rioct-loader) is a webpack loader for Rioct templates, so that you can `require()` directly
template files from JavaScript.

# Topics

- [rioct-cli](RIOCT-CLI.md)
- rioct
- template language reference

