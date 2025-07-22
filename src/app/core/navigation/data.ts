/* eslint-disable */

import { NavigationItem } from "@lhacksrt/components";
import { PERMISSIONS } from "@core/permissions/permissions.data";
// export const defaultNavigation: NavigationItem[] = [
//     {
//         id: 'dashboard',
//         title: 'sidebar.dashboard',
//         type: 'basic',
//         icon: 'fluent:home-16-regular',
//         link: '/dashboard',
//         permission: PERMISSIONS.ALL
//     },
//         // {
//         //     id: 'companies',
//         //     title: 'sidebar.companies',
//         //     type: 'group',
//         //     icon: 'fluent:building-16-regular',
//         //     permission: PERMISSIONS.ALL,
//         //     children: [
//         //         {
//         //             id: 'companies-list',
//         //             title: 'sidebar.companies-list',
//         //             type: 'basic',
//         //             icon: 'fluent:building-people-16-regular',
//         //             link: '/companies/list',
//         //             permission: PERMISSIONS.ALL
//         //         },
//         //         {
//         //             id: 'companies-logos',
//         //             title: 'sidebar.companies-logos',
//         //             type: 'basic',
//         //             icon: 'fluent:image-16-regular',
//         //             link: '/companies/logos',
//         //             permission: PERMISSIONS.ALL
//         //         }
//         //     ]
//         // },
//         {
//         id: 'claims',
//         title: 'sidebar.claims',
//         type: 'group',
//         icon: 'fluent:document-16-regular',
//         permission: PERMISSIONS.ALL,
//         children: [
//             {
//                 id: 'claims-list',
//                 title: 'sidebar.claims-list',
//                 type: 'basic',
//                 icon: 'fluent:document-bullet-list-16-regular',
//                 link: '/claims/list',
//                 permission: PERMISSIONS.ALL
//             },
//             {
//                 id: 'claims-new',
//                 title: 'sidebar.claims-new',
//                 type: 'basic',
//                 icon: 'fluent:document-add-16-regular',
//                 link: '/claims/new',
//                 permission: PERMISSIONS.ALL
//             },
//             {
//                 id: 'claims-documents',
//                 title: 'sidebar.claims-documents',
//                 type: 'basic',
//                 icon: 'fluent:attach-16-regular',
//                 link: '/claims/documents',
//                 permission: PERMISSIONS.ALL
//             },
//             {
//                 id: 'claims-messages',
//                 title: 'sidebar.claims-messages',
//                 type: 'basic',
//                 icon: 'fluent:chat-16-regular',
//                 link: '/claims/messages',
//                 permission: PERMISSIONS.ALL
//             }
//         ]
//     },
//     {
//         id: 'statements',
//         title: 'sidebar.statements',
//         type: 'group',
//         icon: 'fluent:chart-multiple-16-regular',
//         permission: PERMISSIONS.ALL,
//         children: [
//             {
//                 id: 'statements-detailed',
//                 title: 'sidebar.statements-detailed',
//                 type: 'basic',
//                 icon: 'fluent:document-table-16-regular',
//                 link: '/statements/detailed',
//                 permission: PERMISSIONS.ALL
//             },
//             {
//                 id: 'statements-global',
//                 title: 'sidebar.statements-global',
//                 type: 'basic',
//                 icon: 'fluent:document-mention-16-regular',
//                 link: '/statements/global',
//                 permission: PERMISSIONS.ALL
//             },
//             {
//                 id: 'statements-archives',
//                 title: 'sidebar.statements-archives',
//                 type: 'basic',
//                 icon: 'fluent:archive-16-regular',
//                 link: '/statements/archives',
//                 permission: PERMISSIONS.ALL
//             }
//         ]
//     },
//     // {
//     //     id: 'account',
//     //     title: 'sidebar.account',
//     //     type: 'group',
//     //     icon: 'fluent:person-16-regular',
//     //     permission: PERMISSIONS.ALL,
//     //     children: [
//     //         {
//     //             id: 'account-profile',
//     //             title: 'sidebar.profile',
//     //             type: 'basic',
//     //             icon: 'fluent:person-20-regular',
//     //             link: '/account/profile',
//     //             permission: PERMISSIONS.ALL
//     //         },
//     //         {
//     //             id: 'account-password',
//     //             title: 'sidebar.change-password',
//     //             type: 'basic',
//     //             icon: 'fluent:key-16-regular',
//     //             link: '/account/change-password',
//     //             permission: PERMISSIONS.ALL
//     //         }
//     //     ]
//     // },
//     {
//         id: 'admin',
//         title: 'sidebar.admin',
//         type: 'group',
//         icon: 'fluent:shield-checkmark-16-regular',
//         permission: PERMISSIONS.ALL,
//         children: [
//             {
//                 id: 'admin-users',
//                 title: 'sidebar.users',
//                 type: 'basic',
//                 icon: 'fluent:people-16-regular',
//                 link: '/admin/users',
//                 permission: PERMISSIONS.ALL
//             },
//             {
//                 id: 'admin-roles',
//                 title: 'sidebar.roles',
//                 type: 'basic',
//                 icon: 'fluent:apps-list-16-regular',
//                 link: '/admin/roles',
//                 permission: PERMISSIONS.ALL
//             }
//         ]
//     }
// ];

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
            // {
            //     id: 'claims-documents',
            //     title: 'sidebar.claims-documents',
            //     type: 'basic',
            //     icon: 'mat_outline:attach_file',
            //     link: '/claims/documents',
            //     permission: PERMISSIONS.ALL
            // },
            // {
            //     id: 'claims-messages',
            //     title: 'sidebar.claims-messages',
            //     type: 'basic',
            //     icon: 'mat_outline:chat',
            //     link: '/claims/messages',
            //     permission: PERMISSIONS.ALL
            // }
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