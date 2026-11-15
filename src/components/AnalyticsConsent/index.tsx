import {useEffect, useRef, useState, type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const MEASUREMENT_ID = 'G-THZSCXZY06';
const CONSENT_KEY = 'techdoors.ga4-consent.v1';
const SETTINGS_EVENT = 'techdoors:analytics-settings';

type ConsentChoice = 'undecided' | 'accepted' | 'rejected';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
};

function isPublicWebsite(): boolean {
  return ['techdoors.io', 'www.techdoors.io'].includes(window.location.hostname);
}

function configureAnalytics(): void {
  if (!isPublicWebsite()) return;
  const analyticsWindow = window as AnalyticsWindow;
  if (document.querySelector('script[data-techdoors-ga4]')) return;

  // Google Analytics is never loaded before explicit opt-in.
  analyticsWindow.dataLayer ??= [];
  analyticsWindow.gtag = (...args: unknown[]) => {
    analyticsWindow.dataLayer!.push(args);
  };
  const gtag = analyticsWindow.gtag;

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('consent', 'update', {analytics_storage: 'granted'});
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.dataset.techdoorsGa4 = 'true';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function clearAnalyticsCookies(): void {
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim() ?? '')
    .filter((name) => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
  const domains = ['', window.location.hostname, '.techdoors.io'];
  for (const name of cookieNames) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

function readConsent(): ConsentChoice {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'accepted' || value === 'rejected' ? value : 'undecided';
  } catch {
    return 'undecided';
  }
}

export default function AnalyticsConsent(): ReactNode {
  const route = useLocation();
  // Null on SSR and first client render prevents hydration mismatch.
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const openSettings = () => setShowSettings(true);
    window.addEventListener(SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (consent !== 'accepted' || !isPublicWebsite()) return;
    configureAnalytics();

    const url = new URL(window.location.href);
    url.hash = '';
    if (lastTrackedUrl.current === url.href) return;
    lastTrackedUrl.current = url.href;

    // Track SPA route changes once. Initial gtag config has auto page views disabled.
    const frame = window.requestAnimationFrame(() => {
      (window as AnalyticsWindow).gtag?.('event', 'page_view', {
        page_location: url.href,
        page_title: document.title,
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [consent, route.pathname, route.search]);

  function choose(next: Exclude<ConsentChoice, 'undecided'>): void {
    const wasAccepted = consent === 'accepted';
    try {
      window.localStorage.setItem(CONSENT_KEY, next);
    } catch {
      // Keep the choice for this page even when storage is disabled.
    }
    setConsent(next);
    setShowSettings(false);

    if (next === 'rejected' && wasAccepted) {
      (window as AnalyticsWindow).gtag?.('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      clearAnalyticsCookies();
      // Unload the already-inserted Google script immediately.
      window.location.reload();
    }
  }

  // A consent prompt must never cover article content on initial page load.
  // Readers can opt in or change their choice from the footer at any time.
  if (consent === null || !showSettings) return null;

  return (
    <aside className={styles.notice} aria-label="Lựa chọn thống kê truy cập">
      <div className={styles.copy}>
        <strong>Thống kê lượt đọc TechDoors</strong>
        <p>
          Mình dùng Google Analytics để biết khách đến từ quốc gia nào và bài nào được đọc.
          Chỉ bật khi bạn đồng ý. <Link to="/privacy/">Tìm hiểu thêm</Link>
        </p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.decline} onClick={() => choose('rejected')}>
          Không đồng ý
        </button>
        <button type="button" className={styles.accept} onClick={() => choose('accepted')}>
          Cho phép thống kê
        </button>
      </div>
    </aside>
  );
}
