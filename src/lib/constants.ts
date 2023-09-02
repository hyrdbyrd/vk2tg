import { resolve } from 'node:path';

export const APP_ID = 'app';

export const STATIC = resolve(__dirname, '../static');
export const OUT_JSON_PATH = resolve(STATIC, 'out.json');
