import { MarketLevelOrganization } from "./organization/market-level-organization.interface";

export interface CompanyRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
  dateOfCreation?: string | Date;
  supervisorUuid?: string;
}

export enum ManagementEntityType {
  COMPANY = 'COMPANY',
  MARKET_LEVEL_ORGANIZATION = 'MARKET_LEVEL_ORGANIZATION'
}

export interface UpdateCompanyRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  dateOfCreation?: string | Date;
}

export interface MarketLevelOrganisationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
  dateOfCreation?: string | Date;
}

export interface UpdateMarketLevelOrganizationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
  dateOfCreation?: string | Date;
}

export interface CompanyResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
  logo?: string;
  dateOfCreation?: string | Date;
  supervisor?: MarketLevelOrganization
}

export interface ManagementEntityResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  type: 'COMPANY' | 'MARKET_LEVEL_ORGANIZATION';
}

export interface MarketLevelOrganizationResponse {
  id: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
  logo?: string;
  dateOfCreation?: string | Date;
}

export interface EmployeeRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  accessLevel: string;
  managementEntity: string;
  profiles?: string[];
}

export interface EmployeeProfilesRequest {
  profileIds: string[];
}

export interface PasswordUpdateRequest {
  newPassword: string;
}

export interface EmployeeResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  accessLevel: string;
  managementEntity: string;
  isActive: boolean;
  profiles: ProfileResponse[];
}

export interface ProfileRequest {
  name: string;
  description?: string;
  permissions: string[];
  level: string;
}

export interface ProfileUpdate {
  name: string;
  description?: string;
}

export interface ProfileUpdatePermissionsRequest {
  permissions: string[];
}

export interface PermissionResponse {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionResponse[];
  managementEntityId?: string;
  level: ManagementEntityType
}

export interface UpdatePersonalInfos {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  address?: string;
}