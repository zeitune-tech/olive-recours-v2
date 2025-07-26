import { ManagementEntity } from '@core/services/management-entity/management-entity.interface';
import { ManagementEntityType } from '../dto';

export class MarketLevelOrganization extends ManagementEntity {

    constructor(id: string, uuid: string, name: string, email: string, phone: string, address: string, logo: string, level: number, type: ManagementEntityType, acronym: string, fax?: string, gsm?: string, dateOfCreation?: Date) {
        super({id, uuid, name, email, phone, address, logo, level, type});
        this.acronym = acronym;
        this.fax = fax || '';
        this.gsm = gsm || '';
        this.dateOfCreation = dateOfCreation;
    }
}