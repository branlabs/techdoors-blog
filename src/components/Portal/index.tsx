import type {ReactNode} from 'react';
import styles from './styles.module.css';

export default function Portal({compact = false, showCaption = true}: {compact?: boolean; showCaption?: boolean}): ReactNode {
  return (
    <div className={`${styles.portal} ${compact ? styles.compact : ''}`} aria-hidden="true">
      <svg viewBox="0 0 480 440" fill="none" className={styles.drawing}>
        <defs>
          <pattern
            id={compact ? 'grid-small' : 'grid-large'}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M32 0H0v32" stroke="currentColor" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect
          width="480"
          height="440"
          fill={`url(#${compact ? 'grid-small' : 'grid-large'})`}
          opacity=".17"
        />
        <g stroke="currentColor" opacity=".25" strokeWidth="1">
          <path d="m30 350 220-105 220 105-220 100Z" />
          <path d="m30 318 220-105 220 105M62 366l220-106M126 397l220-106M190 428l220-106M62 334l220 105M126 303l220 105M190 272l220 105" />
          <path
            d="M116 75v275M116 96h18M116 327h18M343 75v275M325 96h18M325 327h18"
            strokeDasharray="3 5"
          />
        </g>
        <path
          d="M154 333V101h154v232"
          fill="var(--td-surface)"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M166 328V114h130v214" stroke="currentColor" strokeWidth="1" opacity=".4" />
        <path
          className={styles.door}
          d="m166 114 90 28v218l-90-32Z"
          fill="var(--td-accent)"
          stroke="var(--td-accent)"
          strokeWidth="2"
        />
        <path d="M180 137v176l61 21V156Z" stroke="var(--td-paper)" opacity=".35" />
        <path d="M239 239v21" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
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
      {showCaption && <span className={styles.caption}>Một cánh cửa. Nhiều điều để khám phá.</span>}
    </div>
  );
}
