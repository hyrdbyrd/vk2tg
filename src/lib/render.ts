import { APP_ID } from './constants';
import { GetGroupsResult } from './types';

export const render = (data: GetGroupsResult) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VK2TG</title>
    <link rel="stylesheet" href="/static/index.css">
</head>
<body>
    <div id="${APP_ID}"></div>
    <script>
        window.APP_ID = '${APP_ID}';
        window.OUT_JSON = ${JSON.stringify(data)}
    </script>
    <script src="/static/index.js"></script>
</body>
</html>
    `;
};
