import { useRef } from 'react';
import { TwoInOneSlide } from '../slides/TwoInOneSlide/TwoInOneSlide';
import { LightweightSlide } from '../slides/LightweightSlide/LightweightSlide';
import { MotorSlide } from '../slides/MotorSlide/MotorSlide';
import { WheelNavigation } from '../components/WheelNavigation/WheelNavigation';
import { usePresentationAnimation } from './usePresentationAnimation';
import styles from './styles.module.css';

export function Presentation() {
    const rootRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLElement>(null);
    const { activeIndex, goToSlide } = usePresentationAnimation(rootRef, wheelRef);

    return (
        <div ref={rootRef} className={styles.presentation}>
            <div className={styles.stage} data-presentation-stage>
                <div className={styles.panel} data-slide-panel id="slide-two-in-one">
                    <TwoInOneSlide />
                </div>
                <div className={styles.panel} data-slide-panel id="slide-lightweight">
                    <LightweightSlide />
                </div>
                <div className={styles.panel} data-slide-panel id="slide-motor">
                    <MotorSlide />
                </div>
                <div className={styles.inputLayer} aria-hidden="true" />
                <WheelNavigation ref={wheelRef} activeIndex={activeIndex} onSelect={goToSlide} />
            </div>
        </div>
    );
}
