import type { CSSProperties, Ref } from 'react';
import { useLayoutEffect, useRef } from 'react';
import fan from '../../assets/wheel-icons/fan.svg';
import fanSelected from '../../assets/wheel-icons/fan-selected.svg';
import feather from '../../assets/wheel-icons/pero.svg';
import featherSelected from '../../assets/wheel-icons/pero-selected.svg';
import motor from '../../assets/wheel-icons/motor.svg';
import motorSelected from '../../assets/wheel-icons/motor-selected.svg';
import styles from './styles.module.css';

export interface WheelNavigationProps {
    activeIndex: 0 | 1 | 2;
    onSelect: (index: 0 | 1 | 2) => void;
    ref?: Ref<HTMLElement>;
}

const items = [
    { icon: fan, selectedIcon: fanSelected, lines: ['ФЕН-СТАЙЛЕР', '2 В 1'] },
    { icon: feather, selectedIcon: featherSelected, lines: ['СУПЕРЛЁГКИЙ'] },
    { icon: motor, selectedIcon: motorSelected, lines: ['ИННОВАЦИОННЫЙ', 'ЯПОНСКИЙ МОТОР'] },
];

export function WheelNavigation({ activeIndex, onSelect, ref }: WheelNavigationProps) {
    const slots = [-2, -1, 0, 1, 2];
    const localRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const wheel = localRef.current;
        if (!wheel) return;
        wheel.style.setProperty('--wheel-rotation', '0deg');
        wheel.querySelectorAll<HTMLButtonElement>('[data-wheel-slot]').forEach(button => {
            const slot = Number(button.dataset.wheelSlot);
            button.style.setProperty('--highlight', slot === 0 ? '1' : '0');
            button.style.opacity = Math.abs(slot) <= 1 ? '1' : '0';
            button.style.visibility = Math.abs(slot) <= 1 ? 'visible' : 'hidden';
        });
    }, [activeIndex]);

    return (
        <nav ref={node => {
            localRef.current = node;
            if (typeof ref === 'function') return ref(node);
            if (ref) ref.current = node;
        }} className={styles.wheel} aria-label="Слайды о стайлере" data-presentation-wheel>
            <div className={styles.ring} aria-hidden="true" />
            {slots.map(slot => {
                const index = ((activeIndex - slot + items.length) % items.length) as 0 | 1 | 2;
                const available = Math.abs(slot) <= 1;
                return (
                    <button
                        key={slot}
                        type="button"
                        data-wheel-slot={slot}
                        className={styles.icon}
                        style={{ '--base-angle': `${slot * 17}deg`, '--highlight': slot === 0 ? 1 : 0 } as CSSProperties}
                        aria-label={items[index].lines.join(' ')}
                        aria-controls={['slide-two-in-one', 'slide-lightweight', 'slide-motor'][index]}
                        aria-current={slot === 0 ? 'step' : undefined}
                        aria-hidden={!available || undefined}
                        tabIndex={available ? 0 : -1}
                        onClick={() => onSelect(index)}
                    >
                        <img className={styles.normalIcon} src={items[index].icon} alt="" />
                        <img className={styles.selectedIcon} src={items[index].selectedIcon} alt="" />
                    </button>
                );
            })}
            <p className={styles.label} aria-live="polite" aria-atomic="true">
                {items[activeIndex].lines.map((line) => <span key={line}>{line}</span>)}
            </p>
        </nav>
    );
}
