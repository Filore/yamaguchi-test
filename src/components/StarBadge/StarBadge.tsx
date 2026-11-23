import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface StarBadgeProps {
    children: ReactNode;
    textRotation?: number;
}

export function StarBadge({ children, textRotation = -10 }: StarBadgeProps) {
    return (
        <div className={styles.badge}>
            <span className={styles.text} style={{ transform: `rotate(${textRotation}deg)` }}>
                {children}
            </span>
        </div>
    );
}
