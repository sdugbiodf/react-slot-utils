import type { ComponentType, FC } from 'react';
import { cn } from './common';

type ClassNameDefaultize<P extends { className?: string }> = Omit<
  P,
  'className'
> & { className?: string };

export function withDefaultClassNames<P extends { className?: string }>(
  Component: ComponentType<P>,
  defaultClassNames: string,
): FC<ClassNameDefaultize<P>> {
  type Props = ClassNameDefaultize<P>;

  const Wrapped: FC<Props> = ({ className, ...restProps }) => {
    const mergedClassName = className
      ? cn(defaultClassNames, className)
      : defaultClassNames;

    return <Component {...(restProps as P)} className={mergedClassName} />;
  };

  Wrapped.displayName = `withDefaultClassNames<${Component.displayName || 'Unknown'}>`;

  return Wrapped;
}
