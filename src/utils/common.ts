import type { ComponentType } from 'react';

export { default as cn } from 'classnames';

export function withDisplayName<C extends ComponentType<never>>(
  Component: C,
  name: string,
): C {
  Object.assign(Component, { displayName: name });

  return Component;
}
