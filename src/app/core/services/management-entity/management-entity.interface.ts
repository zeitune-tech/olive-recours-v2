

export const ManagementEntityTypes = {
    ENTITY_SUPERIOR: 'ENTITY_SUPERIOR',
    COMPANY: 'COMPANY',
    BROKER: 'POINT_OF_SALE'
}

export class ManagementEntity {

    id: string;
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
    level: "ENTITY_SUPERIOR" | "COMPANY" | "POINT_OF_SALE";

    constructor(entity: any) {
        this.id = entity?.id || '';
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
    }

}