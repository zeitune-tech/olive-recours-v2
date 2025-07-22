/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";

export const defaultNavigation: NavigationItem[] = [
    {
        id: 'dashboard',
        title: 'sidebar.dashboard',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/dashboard',
        permission: [PERMISSIONS.READ_COMPANY_DASHBOARD, PERMISSIONS.READ_MLA_DASHBOARD, PERMISSIONS.ALL]
    },
    {
        id: 'claims',
        title: 'sidebar.claims',
        type: 'group',
        icon: 'mat_outline:description',
        permission: [PERMISSIONS.READ_CLAIMS, PERMISSIONS.ALL],
        children: [
            {
                id: 'claims-list',
                title: 'sidebar.claims-list',
                type: 'basic',
                icon: 'mat_outline:list_alt',
                link: '/claims/list',
                permission: [PERMISSIONS.READ_CLAIMS, PERMISSIONS.ALL]
            },
            {
                id: 'claims-new',
                title: 'sidebar.claims-new',
                type: 'basic',
                icon: 'mat_outline:add_circle',
                link: '/claims/new',
                permission: [PERMISSIONS.CREATE_CLAIM, PERMISSIONS.ALL]
            },
        ]
    },
    {
        id: 'statements',
        title: 'sidebar.statements',
        type: 'group',
        icon: 'mat_outline:bar_chart',
        permission: [PERMISSIONS.READ_GLOBAL_ACCOUNT_STATUS, PERMISSIONS.READ_GLOBAL_ACCOUNT_STATUS_BETWEEN, PERMISSIONS.ALL],
        children: [
            {
                id: 'statements-detailed',
                title: 'sidebar.statements-detailed',
                type: 'basic',
                icon: 'mat_outline:table_chart',
                link: '/statements/detailed',
                permission: [PERMISSIONS.READ_GLOBAL_ACCOUNT_STATUS, PERMISSIONS.ALL]
            },
            {
                id: 'statements-global',
                title: 'sidebar.statements-global',
                type: 'basic',
                icon: 'mat_outline:leaderboard',
                link: '/statements/global',
                permission: [PERMISSIONS.READ_GLOBAL_ACCOUNT_STATUS_BETWEEN, PERMISSIONS.ALL]
            },
            // {
            //     id: 'statements-archives',
            //     title: 'sidebar.statements-archives',
            //     type: 'basic',
            //     icon: 'mat_outline:archive',
            //     link: '/statements/archives',
            //     permission: PERMISSIONS.ALL
            // }
        ]
    },
    {
        id: 'admin',
        title: 'sidebar.admin',
        type: 'group',
        icon: 'mat_outline:admin_panel_settings',
        permission: [PERMISSIONS.READ_EMPLOYEES, PERMISSIONS.READ_PROFILES, PERMISSIONS.READ_COMPANIES, PERMISSIONS.ALL],
        children: [
            {
                id: 'admin-users',
                title: 'sidebar.users',
                type: 'collapsable',
                icon: 'mat_outline:groups',
                permission: [PERMISSIONS.READ_EMPLOYEES, PERMISSIONS.READ_COMPANIES, PERMISSIONS.ALL],
                children: [
                    {
                        id: 'admin-users-companies',
                        title: 'sidebar.companies',
                        type: 'basic',
                        icon: 'mat_outline:business',
                        link: '/admin/users/companies',
                        permission: [PERMISSIONS.READ_COMPANIES, PERMISSIONS.ALL]
                    },
                    {
                        id: 'admin-users-employees',
                        title: 'sidebar.employees',
                        type: 'basic',
                        icon: 'mat_outline:person_add',
                        link: '/admin/users/employees',
                        permission: [PERMISSIONS.READ_EMPLOYEES, PERMISSIONS.ALL]
                    }
                ]
            },
            {
                id: 'admin-roles',
                title: 'sidebar.roles',
                type: 'basic',
                icon: 'mat_outline:security',
                link: '/admin/roles',
                permission: [PERMISSIONS.READ_PROFILES, PERMISSIONS.ALL]
            },
            {
                id: 'admin-closures',
                title: 'sidebar.closures',
                type: 'basic',
                icon: 'mat_outline:lock',
                link: '/admin/closures',
                permission: [PERMISSIONS.ALL]
            },
        ]
    }
];


export const compactNavigation: NavigationItem[] = [];