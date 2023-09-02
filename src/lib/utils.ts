export type NilType = null | undefined;
export type FalsyType = NilType | 0 | '';

export const truthyOnly = <T>(e: T | FalsyType): e is T => Boolean(e);
export const falsyOnly = <T>(e: T | FalsyType): e is FalsyType => !e;

export const uniq = <S>(i: S[]): S[] => [...new Set(i)];
export const map = <T, U>(arr: T[], cb: (e: T) => U): U[] => arr.map(cb);
export const filter = <T>(arr: T[], cb: (e: T) => boolean): T[] => arr.filter(cb);
export const compact = <T>(arr: Array<T | FalsyType>): T[] => arr.filter(truthyOnly);
