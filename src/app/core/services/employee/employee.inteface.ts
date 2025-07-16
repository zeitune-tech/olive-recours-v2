import { ManagementEntity } from "../management-entity/management-entity.interface";

export class Employee {

    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accessLevel: string;
    managementEntity: ManagementEntity;
    accountNonLocked?: boolean;
    profiles?: any[];

    constructor(employee: any) {
        this.id = employee?.id;
        this.lastName = employee?.lastName;
        this.firstName = employee?.firstName;
        this.email = employee?.email;
        this.password = employee?.password;
        this.accessLevel = employee?.accessLevel;
        this.managementEntity = new ManagementEntity(employee?.managementEntity);
        this.accountNonLocked = employee?.accountNonLocked;
        this.profiles = employee?.profiles;
    }
}


export class Role {
    
    id: number;
    name: string;
    operations: Operation[];

    constructor(role: any) {
        this.id = role?.id;
        this.name = role?.name;
        this.operations = role?.operations?.map((operation: any) => new Operation(operation));
    }
}

export class Operation {
    
    id: number;
    name: string;

    constructor(operation: any) {
        this.id = operation?.id;
        this.name = operation?.name;
    }
}