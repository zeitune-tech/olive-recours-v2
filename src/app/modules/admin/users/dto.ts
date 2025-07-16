export interface CompanyRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
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
}

export interface MarketLevelOrganisationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
}

export interface UpdateMarketLevelOrganizationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
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
  name: string;
  email: string;
  phone: string;
  address: string;
  fax?: string;
  gsm?: string;
  acronym?: string;
  logo?: string;
}

export interface EmployeeRequest {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  address?: string;
  managementEntityId: string;
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
  phone?: string;
  address?: string;
  managementEntityId: string;
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