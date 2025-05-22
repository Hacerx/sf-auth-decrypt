import { getAlias } from "./alias.js";
import { getOrgs, getOrg } from "./orgs.js";

/**
 * Get an object with alias as key and org data as value
 * @returns {Promise<Record<string, import('./types/orgs.js').OrgData>>}
 */
export async function getOrgsMap(){
    const alias = await getAlias();
    const orgs = await getOrgs();
    const result = Object.entries(alias.orgs).reduce((acc, [alias, username]) => {
        const org = orgs.find(el => el.username === username);
        acc[alias] = org;
        return acc;
    }, {});

    return result;
}

export {
    getAlias,
    getOrgs,
    getOrg
}