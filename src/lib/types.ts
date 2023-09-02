export interface Group {
    url?: string;
    name: string;
    icon?: string;
    links: string[];
}

export interface GetGroupsResult {
    found: Group[];
    notFound: Group[];
    excluded: Group[];
}
