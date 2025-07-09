import { ManagementEntity } from "../management-entity/management-entity.interface";

export class Employee {

    id: number;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    managementEntity: ManagementEntity;

    constructor(employee: any) {
        this.id = employee?.id;
        this.name = employee?.name;
        this.lastName = employee?.lastName;
        this.firstName = employee?.firstName;
        this.email = employee?.email;
        this.phone = employee?.phone;
        this.birthDate = employee?.birthDate;
        this.managementEntity = new ManagementEntity(employee?.managementEntity);
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