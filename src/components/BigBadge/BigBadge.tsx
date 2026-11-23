import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface BigBadgeProps {
    icon: ReactNode;
    children: ReactNode;
}

export function BigBadge({ icon, children }: BigBadgeProps) {
    return (
        <div className={styles.badge}>
            {icon}
            {children}
        </div>
    );
}
