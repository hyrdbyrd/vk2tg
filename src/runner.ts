import { runVk } from './services/vk';
import { runTg } from './services/tg';
import { runWeb } from './services/web';

Promise.resolve()
    .then(() => runVk())
    .then(() => runWeb())
    .then(() => runTg());
