import opener from 'opener';
import express from 'express';

import { render } from '../lib/render';
import { input, output } from '../lib/io';
import { constantLog, log } from '../lib/log';
import { STATIC } from '../lib/constants';

const PORT = (() => {
    const port = Number(process.env.PORT);
    if (isNaN(port)) return 3000;
    return port;
})();

export const runWeb = () =>
    new Promise((resolve) => {
        const app = express();

        app.use(express.json())
            .use('/static', express.static(STATIC))
            .get('/', async (_, res) => {
                res.send(render(await output()));
            })
            .post('/cmd', async (req, res) => {
                try {
                    switch (req.body?.type) {
                        case 'save':
                            if (req.body.data) await input(req.body.data);
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
