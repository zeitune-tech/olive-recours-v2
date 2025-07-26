import { ManagementEntityType } from "src/app/modules/admin/users/dto";

export interface ManagementEntityResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
    type: ManagementEntityType;
}