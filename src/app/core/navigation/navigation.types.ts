import { NavigationItem } from "../../../@lhacksrt/components";

export interface Navigation {
    compact: NavigationItem[];
    default: NavigationItem[];
    futuristic: NavigationItem[];
    horizontal: NavigationItem[];
}

export interface Link {
    label: string;
    route: string | string[];
    routerLinkActiveOptions?: { exact: boolean };
    disabled?: boolean;
}