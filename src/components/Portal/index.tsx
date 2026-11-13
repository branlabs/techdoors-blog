import {useState, type ReactNode} from 'react';
import styles from './styles.module.css';

type PortalProps = {
  compact?: boolean;
  showCaption?: boolean;
  interactive?: boolean;
};

export default function Portal({
  compact = false,
  showCaption = true,
  interactive = false,
}: PortalProps): ReactNode {
  const [isHovering, setIsHovering] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const doorState = interactive
    ? isPinnedOpen
      ? 'open'
      : isHovering
        ? 'peek'
        : 'rest'
    : 'rest';

  const gridId = compact ? 'grid-small' : 'grid-large';
  const lightId = compact ? 'portal-light-small' : 'portal-light-large';

  return (
    <div
      className={`${styles.portal} ${compact ? styles.compact : ''}`}
      data-door-state={doorState}
      aria-hidden={interactive ? undefined : true}
    >
      <div className={styles.artwork} aria-hidden="true">
        <svg viewBox="0 0 480 440" fill="none" className={styles.drawing} focusable="false">
          <defs>
            <pattern id={gridId} width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0v32" stroke="currentColor" strokeWidth=".6" />
            </pattern>
            <linearGradient id={lightId} x1="0" y1="0" x2="1" y2=".5">
              <stop offset="0" stopColor="var(--td-accent)" stopOpacity=".29" />
              <stop offset="1" stopColor="var(--td-accent)" stopOpacity=".025" />
            </linearGradient>
          </defs>
          <rect width="480" height="440" fill={`url(#${gridId})`} opacity=".17" />
          <g stroke="currentColor" opacity=".25" strokeWidth="1">
            <path d="m30 350 220-105 220 105-220 100Z" />
            <path d="m30 318 220-105 220 105M62 366l220-106M126 397l220-106M190 428l220-106M62 334l220 105M126 303l220 105M190 272l220 105" />
            <path
              d="M116 75v275M116 96h18M116 327h18M343 75v275M325 96h18M325 327h18"
              strokeDasharray="3 5"
            />
          </g>
          <path
            className={styles.castShadow}
            d="M167 330 260 361 289 368 196 344Z"
            fill="var(--td-ink)"
          />
          <path
            d="M154 333V101h154v232"
            fill="var(--td-surface)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M166 328V114h130v214" stroke="currentColor" strokeWidth="1" opacity=".4" />
          <path
            className={styles.lightReveal}
            d="M168 116h126v210H168Z"
            fill={`url(#${lightId})`}
          />
          {/*
            The hinge is the vertical line x=166. Animated affine projections keep
            both hinge endpoints fixed while the far edge swings in perspective.
            The SVG geometry at rest is identical to the existing illustration.
          */}
          <g className={styles.doorLeaf} data-testid="portal-door-leaf">
            <path
              d="m166 114 90 28v218l-90-32Z"
              fill="var(--td-accent)"
              stroke="var(--td-accent)"
              strokeWidth="2"
            />
            <path d="M180 137v176l61 21V156Z" stroke="var(--td-paper)" opacity=".35" />
            <path d="M239 239v21" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <path
              className={styles.doorEdge}
              d="M256 142l5 2v218l-5-2Z"
              fill="var(--td-ink)"
            />
          </g>
          <path
            d="m269 216 10 10-10 10M293 245h-17"
            stroke="var(--td-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M102 366h31M117.5 350.5v31M332 89h20M342 79v20"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="351" cy="327" r="4" fill="var(--td-accent)" />
          <path d="M355 327h63v-30" stroke="currentColor" opacity=".5" />
          <text x="28" y="34" className={styles.label}>
            TECHDOORS / FIELD NOTES
          </text>
          <text x="322" y="280" className={styles.label}>
            EXPLORE
          </text>
          <text x="28" y="420" className={styles.label}>
            BUILD. BREAK. UNDERSTAND.
          </text>
        </svg>
      </div>
      {interactive && (
        <button
          type="button"
          className={styles.doorHotspot}
          aria-pressed={isPinnedOpen}
          aria-label={isPinnedOpen ? 'Khép cánh cửa minh họa' : 'Mở cánh cửa minh họa'}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
              setIsHovering(true);
            }
          }}
          onPointerLeave={() => setIsHovering(false)}
          onClick={() => {
            setIsPinnedOpen((wasOpen) => !wasOpen);
            setIsHovering(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setIsPinnedOpen(false);
              setIsHovering(false);
            }
          }}
        />
      )}
      {showCaption && <span className={styles.caption}>Một cánh cửa. Nhiều điều để khám phá.</span>}
    </div>
  );
}
