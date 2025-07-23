import { ManagementEntityType } from "src/app/modules/admin/users/dto";

export interface UserCredentials {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    permissions: string[];
    level: ManagementEntityType | null;
}
