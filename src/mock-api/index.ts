import { AuthMockApi } from './common/auth/api';
import { NavigationMockApi } from './common/navigation/api';
import { NotificationsMockApi } from './common/notifications/api';
import { ShortcutsMockApi } from './common/shortcuts/api';
import { UserMockApi } from './common/user/api';


export const mockApiServices = [
    AuthMockApi,
    UserMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    ShortcutsMockApi,
];
