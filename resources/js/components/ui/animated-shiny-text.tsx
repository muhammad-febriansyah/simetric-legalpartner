import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AnimatedShinyTextProps = ComponentPropsWithoutRef<'span'> & {
    children: ReactNode;
    shimmerWidth?: number;
};

export function AnimatedShinyText({
    children,
    className,
    shimmerWidth = 100,
    style,
    ...props
}: AnimatedShinyTextProps) {
    return (
        <span
            style={{ ...style, '--shiny-width': `${shimmerWidth}px` } as CSSProperties}
            className={cn(
                'bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
                'animate-shiny-text bg-linear-to-r from-transparent via-[#2547F9]/90 via-50% to-transparent motion-reduce:animate-none motion-reduce:[transition:none]',
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
