import { MarketLevelOrganization } from "src/app/modules/admin/users/organization/market-level-organization.interface";
import { ManagementEntity } from "../management-entity/management-entity.interface";


export class Company extends ManagementEntity {

    linked: boolean = false;
    supervisor?: MarketLevelOrganization;
    
    constructor(entity: any) {
        super(entity);
        this.linked = entity?.linked || false;
        // dateOfCreation is now handled by ManagementEntity
    }
}