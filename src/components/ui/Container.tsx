
import React from 'react';
import { cn } from '@/lib/utils';

type ContainerProps<T extends React.ElementType = 'div'> = {
  children: React.ReactNode;
  className?: string;
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

const Container = <T extends React.ElementType = 'div'>({
  children,
  className,
  as,
  ...props
}: ContainerProps<T>) => {
  const Component = as || 'div';

  return (
    <Component
      className={cn(
        'w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
