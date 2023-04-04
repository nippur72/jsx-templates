# JSX-TEMPLATES syntax

## Class Component

A plain React class component. 

* `is` determines the outer HTML Tag that contains the whole component ("div" if omitted).
* `this` points to the class component in order to get the type of `Props` and `State`.

MyComponent.html
```html
<MyComponent this="./example" is="div">
   <span>Hello!</span>
</MyComponent>
```

MyComponent.ts
```ts
export class MyComponent extends React.Component<IProps, IState> {
   render = require("./MyComponent.html");
}

// or 

import render from "./MyComponent.html";
export class MyComponent extends React.Component<IProps, IState> {
   render = render;
}
```

### script tags

Script tags contains any TypeScript code. When placed before the component, script are executed at the module level. When placed withing the component script is executed when the react render function is called and are scoped to the tag (and sub tags) that cointains it.

Scripts can be also used to import files in place of the `<import>` tag, or to scope variables in place of the `scope` attribute.

MyComponent.html
```html
<script>
   import { something } from "something";
   let a = 42; // some global value acrosse the module
</script>
<MyComponent this="./example" is="div">
   <script>
      let name = "Tony";
   </script>
   <span>Hello {{ name }}!</span>
</MyComponent>
```


