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
        permission: [PERMISSIONS.READ_DASHBOARD, PERMISSIONS.ALL]
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
        permission: [PERMISSIONS.READ_GLOBAL_STATEMENTS, PERMISSIONS.READ_GLOBAL_STATEMENTS, PERMISSIONS.ALL],
        children: [
            {
                id: 'statements-detailed',
                title: 'sidebar.statements-detailed',
                type: 'basic',
                icon: 'mat_outline:table_chart',
                link: '/statements/detailed',
                permission: [PERMISSIONS.READ_GLOBAL_STATEMENTS, PERMISSIONS.ALL]
            },
            {
                id: 'statements-global',
                title: 'sidebar.statements-global',
                type: 'basic',
                icon: 'mat_outline:leaderboard',
                link: '/statements/global',
                permission: [PERMISSIONS.READ_GLOBAL_STATEMENTS, PERMISSIONS.ALL]
            },
            {
                id: 'statements-annexes',
                title: 'sidebar.statements-annexes',
                type: 'basic',
                icon: 'mat_outline:description', // Changed to a more document/annexes-coherent icon
                link: '/statements/annexe',
                permission: [PERMISSIONS.READ_ANNEXE_STATEMENTS,PERMISSIONS.ALL]
            }
        ]
    },
    {
        id: 'accounting',
        title: 'sidebar.accounting',
        type: 'group',
        icon: 'mat_outline:account_balance',
        permission: [PERMISSIONS.READ_ENCASHMENT_STATEMENTS, PERMISSIONS.READ_SETTLEMENT_STATEMENTS, PERMISSIONS.READ_FEES_STATEMENTS, PERMISSIONS.ALL],
        children: [
            {
                id: 'accounting-encashment',
                title: 'sidebar.encashment',
                type: 'basic',
                icon: 'mat_outline:payments',
                link: '/accounting/encashment',
                permission: [PERMISSIONS.READ_ENCASHMENT_STATEMENTS, PERMISSIONS.ALL]
            },
            {
                id: 'accounting-settlement',
                title: 'sidebar.settlement',
                type: 'basic',
                icon: 'mat_outline:receipt',
                link: '/accounting/settlement',
                permission: [PERMISSIONS.READ_SETTLEMENT_STATEMENTS, PERMISSIONS.ALL]
            },
            {
                id: 'accounting-fees',
                title: 'sidebar.fees',
                type: 'basic',
                icon: 'mat_outline:account_balance',
                link: '/accounting/fees',
                permission: [PERMISSIONS.READ_FEES_STATEMENTS, PERMISSIONS.ALL]
            }
        ]
    },
    {
        id: 'admin',
        title: 'sidebar.admin',
        type: 'group',
        icon: 'mat_outline:admin_panel_settings',
        permission: [PERMISSIONS.READ_EMPLOYEES, PERMISSIONS.READ_PROFILES, PERMISSIONS.READ_COMPANIES,PERMISSIONS.READ_MLOS, PERMISSIONS.MANAGE_CLOSURE, PERMISSIONS.MANAGE_FEES, PERMISSIONS.ALL],
        children: [
            {
                id: 'admin-users',
                title: 'sidebar.users',
                type: 'collapsable',
                icon: 'mat_outline:groups',
                permission: [PERMISSIONS.READ_EMPLOYEES, PERMISSIONS.READ_COMPANIES,PERMISSIONS.READ_MLOS, PERMISSIONS.ALL],
                children: [
                    {
                        id: 'admin-mlo',
                        title: 'sidebar.mlo',
                        type: 'basic',
                        icon: 'mat_outline:account_tree', // Changed to account_tree for organization coherence
                        link: '/admin/users/organization',
                        permission: [PERMISSIONS.READ_MLOS,PERMISSIONS.ALL]
                    },
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
                id: 'admin-params',
                title: 'sidebar.params',
                type: 'basic',
                icon: 'mat_outline:settings',
                link: '/admin/params',
                permission: [PERMISSIONS.MANAGE_CLOSURE, PERMISSIONS.MANAGE_FEES, PERMISSIONS.ALL]
            },
        ]
    }
];


export const compactNavigation: NavigationItem[] = [];