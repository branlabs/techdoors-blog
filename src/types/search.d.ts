// Adapter for the maintained plugin's generated Vietnamese tokenizer.
declare module '@cmfcmf/docusaurus-search-local/lib/client/theme/SearchBar/d-s-l-a-generated' {
  export type SearchToken = {toString(): string};
  export type SearchResult = {ref: string; score: number};
  export type SearchQuery = {
    term(
      tokens: SearchToken[],
      options: {fields: string[]; boost?: number; wildcard?: number},
    ): void;
  };
  export type SearchIndex = {query(callback: (query: SearchQuery) => void): SearchResult[]};
  export const mylunr: {
    Index: {load(data: unknown): SearchIndex};
    Query: {wildcard: {TRAILING: number}};
  };
  export function tokenize(input: string): SearchToken[];
}
