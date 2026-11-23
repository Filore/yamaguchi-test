import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface BadgeProps {
    children: ReactNode;
    theme: 'light' | 'dark';
    className?: string;
}

export function Badge({ children, theme, className }: BadgeProps) {
    return (
        <div className={clsx(styles.badge, styles[theme], className)}>
            {children}
        </div>
    );
}
