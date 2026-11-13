import {useEffect, useId, useMemo, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {
  SearchIndex,
  SearchToken,
} from '@cmfcmf/docusaurus-search-local/lib/client/theme/SearchBar/d-s-l-a-generated';
import styles from './styles.module.css';

type SearchDocument = {id: number; pageTitle: string; sectionTitle: string; sectionRoute: string};
type SearchData = {
  index: SearchIndex;
  documents: Map<string, SearchDocument>;
  tokenize: (input: string) => SearchToken[];
  wildcard: number;
};
let cachedIndex: Promise<SearchData> | undefined;

// Docusaurus builds unlisted pages for direct links. The local-search plugin
// still indexes them, so exclude these intentionally unlisted routes from results.
const unlistedBlogRoutes = new Set([
  '/blog/chao-mung-den-voi-techdoors/',
  '/blog/cloudplay-tu-card-trong-server-den-stream-60fps/',
]);

function readIndex(url: string): Promise<SearchData> {
  cachedIndex ??= Promise.all([
    import('@cmfcmf/docusaurus-search-local/lib/client/theme/SearchBar/d-s-l-a-generated'),
    fetch(url).then(async (response) => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json() as Promise<{documents: SearchDocument[]; index: unknown}>;
    }),
  ])
    .then(([engine, payload]) => ({
      index: engine.mylunr.Index.load(payload.index),
      documents: new Map(payload.documents.map((document) => [String(document.id), document])),
      tokenize: engine.tokenize,
      wildcard: engine.mylunr.Query.wildcard.TRAILING,
    }))
    .catch((error) => {
      cachedIndex = undefined;
      throw error;
    });
  return cachedIndex;
}

export default function SearchBar(): ReactNode {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsList = useRef<HTMLUListElement>(null);
  const titleId = useId();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<SearchData | null>(null);
  const [error, setError] = useState(false);
  const indexUrl = useBaseUrl('/search-index-default.json');
  const isProduction = process.env.NODE_ENV === 'production';

  function showSearch() {
    dialog.current?.showModal();
    setOpen(true);
    input.current?.focus();
  }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else showSearch();
      }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);

  useEffect(() => {
    if (!open || data || !isProduction) return;
    let active = true;
    readIndex(indexUrl)
      .then((value) => {
        if (active) setData(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [open, data, isProduction, indexUrl]);

  const results = useMemo(() => {
    if (!data || !query.trim()) return [];
    const tokens = data.tokenize(query.trim());
    return data.index
      .query((search) => {
        search.term(tokens, {fields: ['title'], boost: 5, wildcard: data.wildcard});
        search.term(tokens, {fields: ['content', 'tags'], wildcard: data.wildcard});
      })
      .flatMap((result) => {
        const document = data.documents.get(result.ref);
        return document ? [document] : [];
      })
      .filter((document) => !unlistedBlogRoutes.has(document.sectionRoute.split('#')[0]))
      .slice(0, 8);
  }, [data, query]);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={showSearch}
        aria-label="Tìm kiếm trên TechDoors"
        aria-haspopup="dialog"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>Tìm kiếm</span>
        <kbd>⌘ / Ctrl K</kbd>
      </button>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby={titleId}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            dialog.current?.close();
          }
        }}
        onClose={() => {
          setOpen(false);
          setQuery('');
          setError(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className={styles.content}>
          <div className={styles.heading}>
            <h2 id={titleId}>Tìm trong TechDoors</h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Đóng tìm kiếm"
            >
              ×
            </button>
          </div>
          <label htmlFor={inputId} className={styles.label}>
            Từ khóa
          </label>
          <input
            ref={input}
            id={inputId}
            type="search"
            placeholder="Thử QEMU, máy ảo, Linux…"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && results.length) {
                event.preventDefault();
                resultsList.current?.querySelector('a')?.focus();
              }
            }}
          />
          <p role="status" className={styles.status}>
            {!isProduction
              ? 'Tìm kiếm khả dụng trong bản build production. Dùng npm run build và npm run serve để kiểm tra.'
              : error
                ? 'Chưa tải được mục lục. Hãy đóng hộp tìm kiếm và thử lại.'
                : !data
                  ? 'Đang tải mục lục…'
                  : !query.trim()
                    ? 'Tìm trong bài viết và các trang của TechDoors.'
                    : results.length
                      ? `${results.length} kết quả. Dùng Tab hoặc phím mũi tên để chọn.`
                      : 'Không tìm thấy kết quả. Thử một từ khóa khác.'}
          </p>
          <ul
            ref={resultsList}
            className={styles.results}
            aria-label="Kết quả tìm kiếm"
            onKeyDown={(event) => {
              if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
              const links = Array.from(resultsList.current?.querySelectorAll('a') ?? []);
              const current = links.indexOf(document.activeElement as HTMLAnchorElement);
              event.preventDefault();
              if (event.key === 'ArrowUp' && current === 0) input.current?.focus();
              else
                links[
                  (current + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
                ]?.focus();
            }}
          >
            {results.map((result) => (
              <li key={result.sectionRoute}>
                <Link to={result.sectionRoute} onClick={() => dialog.current?.close()}>
                  <strong>{result.sectionTitle}</strong>
                  {result.sectionTitle !== result.pageTitle && <span>{result.pageTitle}</span>}
                  <span className={styles.path}>{result.sectionRoute.split('#')[0]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.hint}>
            Esc để đóng · Ctrl / ⌘ K để tìm · Tìm kiếm hoàn toàn trên trình duyệt
          </p>
        </div>
      </dialog>
    </>
  );
}
