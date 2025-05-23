import { Crypto } from './crypto/crypto.js';
import { Global } from './utils/global.js';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { ALIAS_FILENAME } from './alias.js';

const skipFiles = [ALIAS_FILENAME, 'key.json'];

const crypto = new Crypto();
await crypto.init();

/**
 * Get org file content
 * @param {string} path org file path
 * @returns {Promise<import('./types/orgs.js').OrgData>}
 */
export async function getOrg(path){
    if(!existsSync(path)) {
        throw new Error(`Org file not found in path: ${path}`);
    }

    const org = await readFile(path, 'utf8');
    const orgEncrypted = JSON.parse(org);
    const orgDecrypted = crypto.decryptJson(orgEncrypted);
    return orgDecrypted;
}

/**
 * Get all org data contained in a directory
 * @param {string} path Directory path of org files
 * @returns {Promise<import('./types/orgs.js').OrgData[]>}
 */
export async function getOrgs(path = Global.DIR){
    const result = [];
    const stat = await lstat(path);
    const directory = stat.isFile() ? [{name: path, isFile(){ return true }}] : await readdir(path, { withFileTypes: true });
    
    for(const file of directory.filter(el => !skipFiles.includes(el.name) && el.name.endsWith('.json') && el.isFile())){
        result.push(await getOrg(join(path, file.name)));
    }
    
    return result;
}