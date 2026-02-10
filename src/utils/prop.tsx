import {
  type ComponentType,
  cloneElement,
  type FC,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  isDefaultPrevented,
  isEventHandler,
  isEventHandlerValue,
  isStyleObject,
} from '../slot/utils';
import { cn } from './common';

export function withDefaultProps<P extends object, K extends keyof P>(
  Component: ComponentType<Pick<P, K> & Omit<P, K>>,
  defaultProps: Pick<P, K>,
): FC<Omit<P, K>> {
  type Props = Omit<P, K>;

  const Wrapped: FC<Props> = (props) => {
    const propsWithDefaults = { ...defaultProps, ...props };
    return <Component {...propsWithDefaults} />;
  };

  Wrapped.displayName = Component.displayName || 'Unknown';

  return Wrapped;
}

export function withGenericDefaultProps<R extends CallableFunction>(
  Component: CallableFunction,
  defaultProps: Record<string, unknown>,
): R;
export function withGenericDefaultProps(
  Component: CallableFunction,
  defaultProps: Record<string, unknown>,
) {
  const Wrapped = (props: Record<string, unknown>) => {
    const propsWithDefaults = { ...defaultProps, ...props };
    return Reflect.apply(Component, undefined, [propsWithDefaults]);
  };

  Reflect.set(
    Wrapped,
    'displayName',
    Reflect.get(Component, 'displayName') ?? 'Unknown',
  );

  return Wrapped;
}

export function renderWithAdditionalProps<P>(
  element: ReactElement<P> | undefined,
  additionalProps: Partial<P>,
): ReactNode {
  if (!element) {
    return null;
  }

  return cloneElement(element, additionalProps);
}

export function mergeProps(
  parentProps: HTMLAttributes<HTMLElement>,
  childProps: Record<string, unknown>,
) {
  const overrideProps: Record<string, unknown> = { ...childProps };

  for (const propName of Object.keys(childProps)) {
    const slotValue = Reflect.get(parentProps, propName);
    const childValue = Reflect.get(childProps, propName);

    if (isEventHandler(propName)) {
      const slotHandler = isEventHandlerValue(slotValue)
        ? slotValue
        : undefined;
      const childHandler = isEventHandlerValue(childValue)
        ? childValue
        : undefined;

      if (!slotHandler) {
        continue;
      }
      if (!childHandler) {
        overrideProps[propName] = slotHandler;
        continue;
      }

      overrideProps[propName] = (...args: Array<unknown>) => {
        childHandler(...args);
        if (!isDefaultPrevented(args[0])) {
          slotHandler(...args);
        }
      };
      continue;
    }

    if (propName === 'style') {
      const slotStyle = isStyleObject(slotValue) ? slotValue : undefined;
      const childStyle = isStyleObject(childValue) ? childValue : undefined;

      overrideProps[propName] = {
        ...slotStyle,
        ...childStyle,
      };
      continue;
    }

    if (propName === 'className') {
      const slotClassName =
        typeof slotValue === 'string' ? slotValue : undefined;
      const childClassName =
        typeof childValue === 'string' ? childValue : undefined;

      overrideProps[propName] = cn(slotClassName, childClassName);
    }
  }

  return { ...parentProps, ...overrideProps };
}
