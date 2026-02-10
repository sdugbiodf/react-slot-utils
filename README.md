# react-slot-utils

Modern, next-gen React utilities for composing slots and props.
Built for headless and compound component patterns with predictable prop merging.

[![npm version](https://img.shields.io/npm/v/react-slot-utils.svg)](https://www.npmjs.com/package/react-slot-utils)
[![license](https://img.shields.io/npm/l/react-slot-utils.svg)](https://github.com/tyeongkim/react-slot-utils/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-slot-utils)](https://bundlephobia.com/package/react-slot-utils)

## Motivation

React components often need to support custom rendering of their internal elements. While passing a `component` prop or using a render prop works, it often leads to complex prop drilling and breaks the natural JSX structure.

The slot pattern allows you to pass a child element that "merges" with the component's internal element. This provides a clean API for users to customize the underlying DOM element or component while preserving the behavior and styling provided by the parent. This library provides the foundational utilities to implement this pattern reliably.

## Features

- **Predictable Prop Merging**: Intelligently merges class names, styles, and event handlers.
- **Ref Composition**: Automatically composes multiple refs into a single callback ref.
- **Slottable Support**: Allows wrapping specific parts of children to be used as the slot target.
- **Higher-Order Components**: Utilities for setting default props and class names.
- **Type Safe**: Built with TypeScript for excellent developer experience.

## Install

```bash
bun add react-slot-utils
# or
npm install react-slot-utils
```

## Quick Start

### Basic Slot Usage

```tsx
import { Slot } from 'react-slot-utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function Button({ asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button';
  return <Component {...props} className="btn-base" />;
}

// Usage: renders as an <a> tag but with "btn-base" class and button behaviors
export const App = () => (
  <Button asChild>
    <a href="/home">Home</a>
  </Button>
);
```

### Using Slottable

```tsx
import { Slot, Slottable } from 'react-slot-utils';

function Card({ children, ...props }) {
  return (
    <Slot {...props}>
      <div className="card-wrapper">
        <Slottable>{children}</Slottable>
        <span className="decoration">★</span>
      </div>
    </Slot>
  );
}
```

## API Reference

### Components

#### `Slot`
A component that renders its child and merges its own props onto that child.
- If a `Slottable` child is found, it uses the `Slottable`'s children as the primary element.
- Merges `className` using `classnames`.
- Merges `style` objects (shallow merge).
- Composes event handlers (child handler runs first).
- Composes `ref`s.

```tsx
interface SlotProps extends HTMLAttributes<HTMLElement>, PropsWithChildren {
  ref?: Ref<HTMLElement>;
}
```

#### `Slottable`
A utility component used inside `Slot` to mark which part of the children should be treated as the element to be cloned.

### Prop Utilities

#### `mergeProps(parentProps, childProps)`
Merges two sets of props with specific logic:
- **Event Handlers**: Both handlers are called. The child handler executes first. If the child handler calls `event.preventDefault()`, the slot handler is not called.
- **Styles**: Shallow merges style objects. Slot styles are spread first, child styles override.
- **ClassNames**: Merges strings using the `cn` utility.
- **Other Props**: Child props override slot props.

#### `withDefaultProps(Component, defaultProps)`
A HOC that returns a new component with the specified default props applied.
```tsx
function withDefaultProps<P extends object, K extends keyof P>(
  Component: ComponentType<Pick<P, K> & Omit<P, K>>,
  defaultProps: Pick<P, K>,
): FC<Omit<P, K>>
```

#### `withGenericDefaultProps(Component, defaultProps)`
A version of `withDefaultProps` for components with complex generic types.

#### `renderWithAdditionalProps(element, additionalProps)`
Renders a React element with additional props merged in.

### ClassName Utilities

#### `withDefaultClassNames(Component, defaultClassNames)`
A HOC that prepends default class names to the component's `className` prop.
```tsx
function withDefaultClassNames<P extends { className?: string }>(
  Component: ComponentType<P>,
  defaultClassNames: string,
): FC<ClassNameDefaultize<P>>
```

#### `cn(...inputs)`
A re-export of the `classnames` utility for conditional class merging.

### Common Utilities

#### `withDisplayName(Component, name)`
Sets the `displayName` of a component and returns it.

### Slot Utilities

#### `composeRefs(...refs)`
Composes multiple React refs (function or object) into a single callback ref.

#### `flattenChildren(children)`
Flattens React fragments and nested arrays into a flat array of `ReactNode`.

#### `isSlottable(child)`
Type guard to check if a child is a `Slottable` component.

#### `isRef(value)`
Type guard to check if a value is a React `Ref`.

#### `isStyleObject(value)`
Type guard to check if a value is a `CSSProperties` object.

#### `isEventHandler(propName)`
Checks if a prop name starts with `on` followed by an uppercase letter.

## License

MIT © [Taeyeong Kim](https://github.com/tyeongkim)
