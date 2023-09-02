import { readFile, writeFile } from 'node:fs/promises';

import { GetGroupsResult } from './types';
import { OUT_JSON_PATH } from './constants';

export function input(data: GetGroupsResult) {
    return writeFile(OUT_JSON_PATH, JSON.stringify(data, null, 4), { flag: 'w' });
}

export function output() {
    return readFile(OUT_JSON_PATH)
        .then<GetGroupsResult>((e) => JSON.parse(e.toString()))
        .catch<GetGroupsResult>(() => ({ notFound: [], found: [], excluded: [] }));
}
