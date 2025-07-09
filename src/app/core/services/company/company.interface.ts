import { ManagementEntity } from "../management-entity/management-entity.interface";


export class Company extends ManagementEntity {

    linked: boolean = false;
    
    constructor(entity: any) {
        super(entity);
        this.linked = entity?.linked || false;
    }
}