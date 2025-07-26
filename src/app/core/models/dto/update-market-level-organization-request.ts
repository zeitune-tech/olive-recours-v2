import { ManagementEntityType } from "src/app/modules/admin/users/dto";

export interface UpdateMarketLevelOrganizationRequest {
    name: string;
    acronym: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
    fax?: string;
    gsm?: string;
    type?: ManagementEntityType;
    dateOfCreation?: string;
}