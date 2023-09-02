export const tail = console.log;
export const cls = console.clear;

const LOG_TO: any[] = [];

export const constantLog = (...args: any[]) => {
    LOG_TO.push(...args);
    log();
};

export const log = (...args: any[]) => {
    cls();

    tail(...[...LOG_TO, ...args].reduce((acc, cur) => acc.concat('\n', cur), []));
};
