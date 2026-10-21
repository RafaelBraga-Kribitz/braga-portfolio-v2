// Type declarations for src/lib/format.mjs (the JSDoc in the module carries
// the same types under allowJs; this file serves extensionless imports).
export type Lang = 'en' | 'de';

export const NBSP: ' ';
export const MINUS: '−';
export const EN_DASH: '–';

export function number(v: number, lang?: Lang, digits?: number | null): string;
export function currency(v: number, lang?: Lang, digits?: number): string;
export function percent(v: number, lang?: Lang, digits?: number | null): string;
export function unit(v: number, u: string, lang?: Lang, digits?: number | null): string;
export function date(iso: string, lang?: Lang): string;
export function range(a: string | number, b: string | number): string;
export function equation(sym: string, v: number, lang?: Lang, digits?: number | null): string;
export function ellipsis(s: string): string;
export function quotes(text: string, lang?: Lang): string;
export function dash(lang?: Lang): string;

export interface Case {
  name: string;
  run: (lang: Lang) => string;
  en: string;
  de: string;
}
export const CASES: Case[];

export interface CaseResult {
  name: string;
  en: string;
  de: string;
  enOk: boolean;
  deOk: boolean;
  ok: boolean;
}
export function runCases(): CaseResult[];
