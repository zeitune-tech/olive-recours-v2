/* eslint-disable */
const adminRole = {
    id         : '1',
    name       : 'ADMIN',
    permissions: [
        'ADMIN_SPACE', 'STAFF_SPACE', 'USER_SPACE'
    ]
}

const tenantRole = {
    id         : '2',
    name      : 'TENANT',
    permissions: [
        'PRE_ADMIN_SPACE',
        'PRE_ADMIN_BUSSINESS_VIEW',
        'PRE_ADMIN_POINT_OF_SALE_VIEW',
        'PRE_ADMIN_EMPLOYEES_VIEW',
        'PRE_ADMIN_PROFILES_VIEW'
    ]
}

const staffRole = {
    id         : '3',
    name       : 'STAFF',
    permissions: [
        'STAFF_SPACE',
        'STAFF_POINT_OF_SALE_VIEW',
        'STAFF_EMPLOYEES_VIEW',
        'STAFF_PROFILES_VIEW'
    ]
}

export const user = {
    id    : 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df',
    name  : 'Brian Hughes',
    email : 'hughes.brian@company.com',
    avatar: 'assets/images/avatars/brian-hughes.jpg',
    status: 'online',
    roles : [adminRole,tenantRole, staffRole],
    
};

export const users = [
    {

    }
]