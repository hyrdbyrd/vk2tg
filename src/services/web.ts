import { readFile, writeFile } from 'node:fs/promises';

import opener from 'opener';
import express from 'express';

import { render } from '../lib/render';
import { constantLog, log } from '../lib/log';
import { GetGroupsResult } from '../lib/types';
import { OUT_JSON_PATH, STATIC } from '../lib/constants';

const PORT = (() => {
    const port = Number(process.env.PORT);
    if (isNaN(port)) return 3000;
    return port;
})();

export const runServer = () =>
    new Promise((resolve) => {
        const app = express();

        app.use(express.json())
            .use('/static', express.static(STATIC))
            .get('/', async (_, res) => {
                const jsonData = await readFile(OUT_JSON_PATH)
                    .then<GetGroupsResult>((e) => JSON.parse(e.toString()))
                    .catch<GetGroupsResult>(() => ({ notFound: [], found: [], excluded: [] }));

                res.send(render(jsonData));
            })
            .post('/cmd', async (req, res) => {
                try {
                    switch (req.body?.type) {
                        case 'save':
                            if (req.body.data)
                                await writeFile(OUT_JSON_PATH, JSON.stringify(req.body.data, null, 4), { flag: 'w' });
                    }
                } catch (e) {
                    log('ERROR:', e);
                }

                res.sendStatus(200);
            })
            .listen(PORT, () => {
                const url = `http://localhost:${PORT}`;
                constantLog(`Web: ✅ ${url}`);

                opener(url);

                resolve(undefined);
            });
    });
