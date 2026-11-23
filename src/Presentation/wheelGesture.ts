// Trackpad momentum can overlap the next gesture without a long silent gap.
// Ignore the fading tail, but accept a reversal or a renewed acceleration.
export function createWheelGesture() {
    let lastTime = -Infinity;
    let direction = 0;
    let accumulated = 0;
    let consumed = false;
    let peak = 0;
    let tail = Infinity;

    const reset = () => {
        lastTime = -Infinity;
        direction = 0;
        accumulated = 0;
        consumed = false;
        peak = 0;
        tail = Infinity;
    };

    const feed = (delta: number, time: number, transitioning: boolean): -1 | 0 | 1 => {
        const magnitude = Math.abs(delta);
        if (!Number.isFinite(delta) || magnitude < 1) return 0;
        const nextDirection = Math.sign(delta);
        const idle = time - lastTime >= 160;
        const reversed = nextDirection !== direction && magnitude >= 4;
        const accelerated = consumed && magnitude >= 8 && tail <= peak / 2 && magnitude >= tail * 2;

        if (idle || reversed || (!transitioning && accelerated)) {
            accumulated = 0;
            consumed = false;
            peak = 0;
            tail = Infinity;
        }
        lastTime = time;
        direction = nextDirection;
        peak = Math.max(peak, magnitude);

        if (transitioning) {
            consumed = true;
            accumulated = 0;
            tail = Math.min(tail, magnitude);
            return 0;
        }
        if (consumed) {
            tail = Math.min(tail, magnitude);
            return 0;
        }
        accumulated += delta;
        if (Math.abs(accumulated) < 30) return 0;
        consumed = true;
        tail = magnitude;
        return accumulated > 0 ? 1 : -1;
    };

    return { feed, reset };
}
