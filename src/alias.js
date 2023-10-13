import { Global } from './utils/global.js';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const ALIAS_FILENAME = 'alias.json';

export async function getAlias(path = join(Global.DIR, ALIAS_FILENAME)) {

    if(!existsSync(path)) {
        throw new Error(`Alias file not found in path: ${path}`);
    }

    const alias = await readFile(path, 'utf8');
    return JSON.parse(alias);
}