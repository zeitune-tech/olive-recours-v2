export type Layout =
    | 'empty'
    | 'custom'
    | 'classic'
    | 'classy'
    | 'compact'
    | 'thin';

    // Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];

export interface AppStylesConfig {
    layout: Layout;
    scheme: Scheme;
    screens: Screens;
    theme: Theme;
    themes: Themes;
}