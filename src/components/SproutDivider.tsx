import { asset } from '../lib/asset';

/**
 * A hairline rule punctuated by the bbit seed — the hand-drawn APNG
 * sprouting on loop. Reduced-motion visitors get a still pixel seedling,
 * already grown.
 */

// still fallback bitmap: [x, y(from bottom), color-index] 0=stem 1=leaf 2=leaf-lite
const SPROUT: Array<[number, number, number]> = [
  [2, 0, 0],
  [2, 1, 0],
  [2, 2, 0],
  [1, 2, 1],
  [0, 3, 1],
  [2, 3, 1],
  [3, 3, 2],
  [4, 4, 2],
];
const COLORS = ['var(--moss-deep)', 'var(--moss)', 'var(--moss-bright)'];
const U = 5;
const ROWS = 5;

export function SproutDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <img
        className="divider-sprout divider-sprout--animated"
        src={asset('images/bbit-animated.png')}
        alt=""
        width="335"
        height="480"
        loading="lazy"
      />
      <svg
        className="divider-sprout divider-sprout--still"
        viewBox={`0 0 ${6 * U} ${ROWS * U}`}
      >
        {SPROUT.map(([x, y, c], i) => (
          <rect
            key={i}
            x={x * U}
            y={(ROWS - 1 - y) * U}
            width={U + 0.4}
            height={U + 0.4}
            fill={COLORS[c]}
          />
        ))}
      </svg>
    </div>
  );
}
