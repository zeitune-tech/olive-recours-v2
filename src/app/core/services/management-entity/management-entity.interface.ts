import { ManagementEntityType } from "src/app/modules/admin/users/dto";


export const ManagementEntityTypes = {
    ENTITY_SUPERIOR: 'ENTITY_SUPERIOR',
    COMPANY: 'COMPANY',
    BROKER: 'POINT_OF_SALE'
}

export class ManagementEntity {

    id: string;
    uuid: string;
    name: string;
    acronym: string;
    email: string;
    phone: string;
    address: string;
    fax: string;
    gsm: string;
    legalStatus: string;
    registrationNumber: string;
    logo: string;
    level: ManagementEntityType;
    type: ManagementEntityType;
    dateOfCreation?: string | Date;

    constructor(entity: any) {
        this.id = entity?.id || '';
        this.uuid = entity?.uuid || '';
        this.name = entity?.name || '';
        this.acronym = entity?.acronym || '';
        this.legalStatus = entity?.legalStatus || '';
        this.registrationNumber = entity?.registrationNumber || '';
        this.fax = entity?.fax || '';
        this.gsm = entity?.gsm || '';
        this.level = entity?.level || '';
        this.logo = entity?.logo || '';
        this.email = entity?.email || '';
        this.phone = entity?.phone || '';
        this.address = entity?.address || '';
        this.dateOfCreation = entity?.dateOfCreation;
        this.type = entity?.type || ManagementEntityType.COMPANY;
    }

}