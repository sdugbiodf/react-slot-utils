import {
  Children,
  type CSSProperties,
  Fragment,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { Slottable } from '.';

export function isSlottable(
  child: ReactNode,
): child is ReactElement<PropsWithChildren> {
  return isValidElement(child) && child.type === Slottable;
}

export function flattenChildren(children: ReactNode): Array<ReactNode> {
  const result: Array<ReactNode> = [];

  for (const child of Children.toArray(children)) {
    if (isFragment(child)) {
      result.push(...flattenChildren(child.props.children));
      continue;
    }
    result.push(child);
  }

  return result;
}

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (isRefObject<T>(ref)) {
        ref.current = node;
      }
    }
  };
}

export function isEventHandler(propName: string) {
  return /^on[A-Z]/.test(propName);
}

export function isEventHandlerValue(
  value: unknown,
): value is (...args: Array<unknown>) => void {
  return typeof value === 'function';
}

export function isRef<T>(value: unknown): value is Ref<T> {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && 'current' in value)
  );
}

export function isStyleObject(value: unknown): value is CSSProperties {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isDefaultPrevented(event: unknown) {
  if (!event || typeof event !== 'object') {
    return false;
  }

  return Reflect.get(event, 'defaultPrevented') === true;
}

function isFragment(
  child: ReactNode,
): child is ReactElement<PropsWithChildren> {
  return isValidElement(child) && child.type === Fragment;
}

function isRefObject<T>(ref: unknown): ref is RefObject<T | null> {
  return typeof ref === 'object' && ref !== null && 'current' in ref;
}
