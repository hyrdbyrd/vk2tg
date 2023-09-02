import { writeFile } from 'node:fs/promises';

import { VK } from 'vk-io';

import { log, constantLog } from '../lib/log';
import { OUT_JSON_PATH } from '../lib/constants';
import { uniq, map, compact } from '../lib/utils';
import { GetGroupsResult, Group } from '../lib/types';

const vk = new VK({ token: process.env.VK_TOKEN || '' });

const extractTg = (str?: string) => str?.match(/https:\/\/t.me\/[^\s]+/)?.[0] ?? '';

const getTgLinks = (links: string[]) => uniq(compact(map(links, extractTg)));

export async function getGroups(): Promise<GetGroupsResult> {
    const groups: Promise<Group | null>[] = [];

    let setteld = 0;
    const groupIds = (await vk.api.groups.get({})).items;

    for (const group_id of groupIds) {
        const group = vk.api.groups
            .getById({ group_id, fields: ['description', 'links', 'site', 'wiki_page'] })
            .then(([group]) => group)
            .then(
                (group): Group => ({
                    name: group.name!,
                    icon: group.photo_50,
                    url: group.screen_name ? `https://vk.com/${group.screen_name}` : undefined,
                    links: getTgLinks([
                        group.site,
                        group.wiki_page,
                        group.description,
                        ...compact(group.links?.map((link) => link.url || '') || []),
                    ]),
                })
            )
            .catch(() => null)
            .finally(() => {
                log(`VK: Обработано ${++setteld} из ${groupIds.length}`);
            });

        groups.push(group);
    }

    const every = compact(await Promise.all(groups)).reduce<GetGroupsResult>(
        (acc, cur) => {
            if (cur.links.length) acc.found.push(cur);
            else acc.notFound.push(cur);

            return acc;
        },
        { found: [], notFound: [], excluded: [] }
    );

    await writeFile(OUT_JSON_PATH, JSON.stringify(every, null, 4), { flag: 'w' });

    constantLog('VK: ✅');

    return every;
}
