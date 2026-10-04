/**
 * The motion half of liquid glass: SwiftUI's spring, integrated per frame.
 *
 * A spring carries its velocity into a new target, so a surface that is
 * pressed, released and pressed again continues rather than restarting —
 * the reason Apple's glass reads as an object rather than an animation.
 * `response` is the period of one oscillation in seconds and `damping` the
 * fraction of critical, exactly as SwiftUI parameterises it.
 */
export class Spring {
  constructor(response, damping, value = 0) {
    this.w = 0;
    this.z = 1;
    this.v = 0;
    this.setParams(response, damping);
    this.x = value;
    this.target = value;
  }

  setParams(response, damping) {
    this.w = (2 * Math.PI) / Math.max(0.02, response);
    this.z = damping;
  }

  step(dt) {
    if (!(dt > 0)) return this.x;
    /* A backgrounded tab hands back seconds of dt; clamp before integrating. */
    if (dt > 0.064) dt = 0.064;
    const n = Math.min(32, Math.max(1, Math.ceil((dt * this.w) / 0.35)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -this.w * this.w * (this.x - this.target) - 2 * this.z * this.w * this.v;
      this.v += a * h;
      this.x += this.v * h;
    }
    return this.x;
  }

  settled(eps = 0.05) {
    return Math.abs(this.x - this.target) < eps && Math.abs(this.v) < eps * 10;
  }

  snap(value) {
    this.x = value;
    this.target = value;
    this.v = 0;
  }
}

/**
 * Reduce Motion is about oscillation, not speed: forcing at least critical
 * damping keeps a surface responsive while removing overshoot entirely.
 */
export const dampFor = (damping, reduceMotion) => (reduceMotion ? Math.max(1, damping) : damping);
