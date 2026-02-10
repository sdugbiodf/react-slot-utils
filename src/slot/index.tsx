import type { HTMLAttributes, PropsWithChildren, ReactNode, Ref } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { mergeProps } from '../utils/prop';
import { composeRefs, flattenChildren, isRef, isSlottable } from './utils';

export interface SlotProps
  extends HTMLAttributes<HTMLElement>,
    PropsWithChildren {
  ref?: Ref<HTMLElement>;
}

export function Slottable(props: PropsWithChildren) {
  const { children } = props;

  return children ?? null;
}

export function Slot(props: SlotProps) {
  const { children, ref: slotRef, ...slotProps } = props;
  const childrenArray = flattenChildren(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child !== slottable) {
        return child;
      }

      if (Children.count(newElement) > 1) {
        return Children.only(null);
      }

      return isValidElement<PropsWithChildren>(newElement)
        ? newElement.props.children
        : null;
    });

    if (isValidElement(newElement)) {
      return (
        <SlotClone ref={slotRef} {...slotProps}>
          {cloneElement(newElement, undefined, newChildren)}
        </SlotClone>
      );
    }

    return null;
  }

  return (
    <SlotClone ref={slotRef} {...slotProps}>
      {children}
    </SlotClone>
  );
}

interface SlotCloneProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

function SlotClone(props: SlotCloneProps) {
  const { children, ref: slotRef, ...slotProps } = props;

  if (isValidElement<Record<string, unknown>>(children)) {
    const childRef = isRef<HTMLElement>(children.props.ref)
      ? children.props.ref
      : undefined;
    const mergedProps = mergeProps(slotProps, children.props);
    const composedRef = slotRef ? composeRefs(slotRef, childRef) : childRef;

    return cloneElement(children, { ...mergedProps, ref: composedRef });
  }

  return Children.count(children) > 1 ? Children.only(null) : null;
}
