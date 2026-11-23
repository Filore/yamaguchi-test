import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import { createWheelGesture } from './wheelGesture';

type SlideIndex = 0 | 1 | 2;
const wrap = (index: number) => ((index + 3) % 3) as SlideIndex;

export function usePresentationAnimation(
    rootRef: RefObject<HTMLDivElement | null>,
    wheelRef: RefObject<HTMLElement | null>,
) {
    const [activeIndex, setActiveIndex] = useState<SlideIndex>(0);
    const selected = useRef<SlideIndex>(0);
    const navigate = useRef<(index: SlideIndex) => void>(() => {});
    const lastMode = useRef<boolean | null>(null);
    const goToSlide = useCallback((index: SlideIndex) => navigate.current(index), []);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const wheel = wheelRef.current;
        if (!root || !wheel) return;

        const stage = root.querySelector<HTMLElement>('[data-presentation-stage]')!;
        const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-slide-panel]'));
        const buttons = Array.from(wheel.querySelectorAll<HTMLButtonElement>('[data-wheel-slot]'));
        const media = gsap.matchMedia();

        const select = (index: SlideIndex, animated: boolean) => {
            if (selected.current !== index) {
                selected.current = index;
                setActiveIndex(index);
            }
            panels.forEach((panel, panelIndex) => {
                const hidden = animated && panelIndex !== index;
                if (hidden && panel.contains(document.activeElement)) {
                    buttons.find(button => button.dataset.wheelSlot === '0')
                        ?.focus({ preventScroll: true });
                }
                panel.inert = hidden;
                if (hidden) panel.setAttribute('aria-hidden', 'true');
                else panel.removeAttribute('aria-hidden');
            });
        };

        media.add({
            all: 'all',
            desktop: '(min-width: 1024px)',
            reducedMotion: '(prefers-reduced-motion: reduce)',
        }, context => {
            const animated = Boolean(context.conditions?.desktop && !context.conditions?.reducedMotion);
            const restorePosition = lastMode.current !== null && lastMode.current !== animated;
            lastMode.current = animated;
            const restoreIndex = selected.current;
            let frame = 0;
            let disposed = false;

            if (!animated) {
                delete root.dataset.animated;
                select(restoreIndex, false);
                navigate.current = index => panels[index].scrollIntoView({ block: 'start' });
                const track = () => {
                    if (frame) return;
                    frame = requestAnimationFrame(() => {
                        frame = 0;
                        if (disposed) return;
                        const center = window.innerHeight / 2;
                        const distances = panels.map(panel => {
                            const rect = panel.getBoundingClientRect();
                            return rect.top <= center && rect.bottom >= center
                                ? 0 : Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center));
                        });
                        select(distances.indexOf(Math.min(...distances)) as SlideIndex, false);
                    });
                };
                if (restorePosition) {
                    frame = requestAnimationFrame(() => {
                        frame = 0;
                        if (disposed) return;
                        panels[restoreIndex].scrollIntoView({ block: 'start', behavior: 'instant' });
                        track();
                    });
                } else track();
                window.addEventListener('scroll', track, { passive: true });
                return () => {
                    disposed = true;
                    cancelAnimationFrame(frame);
                    window.removeEventListener('scroll', track);
                    navigate.current = () => {};
                };
            }

            root.dataset.animated = 'true';
            let transition: gsap.core.Timeline | null = null;
            const wheelGesture = createWheelGesture();
            let touchStart: { x: number; y: number } | null = null;

            const renderWheel = (step: number) => {
                wheel.style.setProperty('--wheel-rotation', `${17 * step}deg`);
                buttons.forEach(button => {
                    const angle = (Number(button.dataset.wheelSlot) + step) * 17;
                    const highlight = Math.max(0, 1 - Math.abs(angle) / 17);
                    const opacity = Math.max(0, Math.min(1, (25 - Math.abs(angle)) / 8));
                    button.style.setProperty('--highlight', String(highlight));
                    button.style.opacity = String(opacity);
                    button.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
                });
            };

            const settle = () => {
                wheelGesture.reset();
                touchStart = null;
                transition?.kill();
                transition = null;
                gsap.set(panels, { yPercent: 100, autoAlpha: 0 });
                gsap.set(panels[selected.current], { yPercent: 0, autoAlpha: 1 });
                select(selected.current, true);
                renderWheel(0);
            };

            const move = (direction: 1 | -1) => {
                if (disposed || transition) return;
                cancelAnimationFrame(frame);
                frame = 0;
                const from = selected.current;
                const to = wrap(from + direction);
                const focusWheel = wheel.contains(document.activeElement);
                const progress = { step: 0 };
                gsap.set(panels[to], { yPercent: direction * 100, autoAlpha: 0 });
                transition = gsap.timeline({
                    defaults: { duration: 0.7, ease: 'power2.inOut' },
                    onComplete: () => {
                        transition = null;
                        select(to, true);
                        // Rebase the five wheel slots in WheelNavigation's layout effect.
                        frame = requestAnimationFrame(() => {
                            frame = 0;
                            if (!disposed && focusWheel) {
                                buttons.find(button => button.dataset.wheelSlot === '0')
                                    ?.focus({ preventScroll: true });
                            }
                        });
                    },
                });
                transition
                    .to(panels[from], { yPercent: -direction * 100, autoAlpha: 0 }, 0)
                    .to(panels[to], { yPercent: 0, autoAlpha: 1 }, 0)
                    .to(progress, { step: direction, onUpdate: () => renderWheel(progress.step) }, 0);
            };

            navigate.current = index => {
                if (index !== selected.current) move(wrap(index - selected.current) === 1 ? 1 : -1);
            };

            const onWheel = (event: WheelEvent) => {
                if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
                const rect = stage.getBoundingClientRect();
                if (event.clientX < rect.left || event.clientX > rect.right
                    || event.clientY < rect.top || event.clientY > rect.bottom) return;
                if (event.cancelable) event.preventDefault();
                const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
                const direction = wheelGesture.feed(delta, performance.now(), transition !== null);
                if (direction) move(direction);
            };
            const onKey = (event: KeyboardEvent) => {
                if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
                const rect = stage.getBoundingClientRect();
                if (rect.top > 1 || rect.bottom < window.innerHeight - 1) return;
                if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(event.key)) {
                    event.preventDefault();
                    if (!event.repeat) move(['ArrowDown', 'PageDown'].includes(event.key) ? 1 : -1);
                }
            };
            const onTouchStart = (event: TouchEvent) => {
                touchStart = !transition && event.touches.length === 1
                    ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
            };
            const onTouchEnd = (event: TouchEvent) => {
                if (!touchStart || event.touches.length || !event.changedTouches.length) return;
                const dx = event.changedTouches[0].clientX - touchStart.x;
                const dy = event.changedTouches[0].clientY - touchStart.y;
                touchStart = null;
                if (Math.abs(dy) >= 30 && Math.abs(dy) > Math.abs(dx)) move(dy < 0 ? 1 : -1);
            };
            const onTouchCancel = () => { touchStart = null; };

            settle();
            if (restorePosition) {
                frame = requestAnimationFrame(() => {
                    frame = 0;
                    if (!disposed) root.scrollIntoView({ block: 'start', behavior: 'instant' });
                });
            }
            // A trackpad sequence can remain targeted at a panel after it becomes
            // hidden/inert. Capture on window rather than depending on that target.
            window.addEventListener('wheel', onWheel, { passive: false, capture: true });
            stage.addEventListener('touchstart', onTouchStart, { passive: true });
            stage.addEventListener('touchend', onTouchEnd, { passive: true });
            stage.addEventListener('touchcancel', onTouchCancel);
            window.addEventListener('keydown', onKey);
            window.addEventListener('resize', settle);
            window.addEventListener('blur', settle);

            return () => {
                disposed = true;
                cancelAnimationFrame(frame);
                transition?.kill();
                window.removeEventListener('wheel', onWheel, true);
                stage.removeEventListener('touchstart', onTouchStart);
                stage.removeEventListener('touchend', onTouchEnd);
                stage.removeEventListener('touchcancel', onTouchCancel);
                window.removeEventListener('keydown', onKey);
                window.removeEventListener('resize', settle);
                window.removeEventListener('blur', settle);
                navigate.current = () => {};
                delete root.dataset.animated;
                gsap.set(panels, { clearProps: 'transform,opacity,visibility' });
                panels.forEach(panel => {
                    panel.inert = false;
                    panel.removeAttribute('aria-hidden');
                });
                wheel.style.removeProperty('--wheel-rotation');
                buttons.forEach(button => {
                    button.style.removeProperty('--highlight');
                    button.style.removeProperty('opacity');
                    button.style.removeProperty('visibility');
                });
            };
        });

        return () => media.revert();
    }, [rootRef, wheelRef]);

    return { activeIndex, goToSlide };
}
