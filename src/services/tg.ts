import TelegramBot from 'node-telegram-bot-api';

import { output } from '../lib/io';
import { constantLog } from '../lib/log';

export function runTg() {
    const bot = new TelegramBot(process.env.TG_TOKEN || '', { polling: true });

    bot.onText(/\/show/, async (msg) => {
        const data = await output();

        bot.createChatInviteLink
        bot.sendMessage(msg.chat.id, data.found.reduce<string[]>((acc, cur) => acc.concat(cur.links), []).join('\n'));
    });

    bot.onText(/\/ping/, (msg) => {
        bot.sendMessage(msg.chat.id, 'pong');
    });

    constantLog('TG: ✅');
}
