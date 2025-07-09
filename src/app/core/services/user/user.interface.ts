import { ManagementEntity } from "../management-entity/management-entity.interface";

export class User {

    id: string;
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    entityAccessLevel: string;
    managementEntity: ManagementEntity;
    permissions: string[];

    constructor(user: any) {
        this.id = user?.id || '';
        this.avatar = user?.avatar || '';
        this.firstName = user?.firstName || '';
        this.lastName = user?.lastnNme || '';
        this.email = user?.email || '';
        this.password = user?.password || '';
        this.entityAccessLevel = user?.entityAccessLevel || '';
        this.permissions = user?.permissions || [];
        this.managementEntity = user?.managementEntity || null;
    }
}