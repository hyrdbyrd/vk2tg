import { getGroups } from './services/vk';
import { runServer } from './services/web';

Promise.resolve()
    .then(() => getGroups())
    .then(() => runServer());
