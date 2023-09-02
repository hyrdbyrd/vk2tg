/** @typedef {{ name: string; links: string[]; icon?: string; url?: string }} Group */
/** @typedef {{ found: Group[]; notFound: Group[]; excluded: Group[] }} Out */

/** @type {string} */
const ID = window.APP_ID;
/** @type {Out} */
const OUT = window.OUT_JSON;

/**
 * @param {string} tagName
 * @param {Record<string, string> | string} attrs
 * @param {Array<HTMLElement | string> | HTMLElement | string} content
 * @param {Record<string, any>} listeners
 * @returns {HTMLElement}
 */
const el = (tagName = 'div', attrs = {}, content = [], listeners = {}) => {
    const element = document.createElement(tagName);

    if (typeof attrs === 'string') attrs = { class: attrs };

    if (Object(attrs) === attrs) for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);

    for (const [eventName, cb] of Object.entries(listeners)) element.addEventListener(eventName, cb);

    element.append(...[].concat(content));

    return element;
};

const elDiv = el.bind(null, 'div');

/**
 * @param {Group[]} group
 */
const mkRows = (group, mod, click) => {
    if (!group.length) {
        return el('div', '', 'Тут пока ничего нет');
    }

    return group.map((item, idx) =>
        el(
            'div',
            `row row_${mod || ''}`,
            [
                item.icon ? el('img', { src: item.icon, class: 'row__icon' }) : '',
                el('div', 'row__content', [
                    el('p', 'row__name', item.name),
                    item.url ? el('p', 'row__links', el('a', { href: item.url, target: '_blank' }, item.url)) : '',
                    item.links.length
                        ? el(
                              'p',
                              'row__links',
                              item.links.reduce(
                                  (acc, href) => acc.concat(el('a', { href, target: '_blank' }, href), el('br')),
                                  []
                              )
                          )
                        : '',
                ]),
            ],
            { click: () => click?.(idx) }
        )
    );
};

window.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById(ID);
    if (!root) return;

    const render = (changed = false) => {
        root.innerHTML = '';
        root.append(
            el('div', 'table', [
                el('div', 'col col_400', mkRows(OUT.notFound, '400')),
                el(
                    'div',
                    'col col_300',
                    mkRows(OUT.excluded || [], '300', (idx) => {
                        OUT.found.push(...OUT.excluded.splice(idx, 1));
                        render(true);
                    })
                ),
                el(
                    'div',
                    'col col_200',
                    mkRows(OUT.found, '200', (idx) => {
                        OUT.excluded.push(...OUT.found.splice(idx, 1));
                        render(true);
                    })
                ),
            ])
        );

        if (!changed) return;

        let clicked = false;
        const save = el('button', 'save', 'Сохранить', {
            click: () => {
                if (clicked) return;

                clicked = true;
                save.innerText = 'Сохраняем...';

                fetch('/cmd', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type: 'save', data: OUT }),
                }).then(() => render(false));
            },
        });

        root.append(save);
    };

    render();
});
