# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 18 application called "olive-recours-v2" (zeitune-claiming) - a claims management system with multi-level organization support. The application handles insurance claims, statements, accounting operations, and user management with role-based permissions.

## Essential Commands

### Development
- `npm start` or `ng serve` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes in development mode
- `npm test` or `ng test` - Run unit tests with Karma/Jasmine

### Architecture Commands
- Check for circular dependencies: `npx madge --circular --extensions ts src/`

## Architecture Overview

### Core Structure
- **Custom Framework**: Built on `@lhacksrt` custom template framework located in `src/@lhacksrt/`
- **Module-Based**: Uses Angular modules (not standalone components - see angular.json schematics config)
- **Multi-tenant**: Supports Market Level Organizations (MLOs), Companies, and Employees
- **Permission-Based**: Role-based access control throughout the application

### Key Directories

#### `src/@lhacksrt/` - Custom Template Framework
- Custom UI components (alerts, cards, navigation, tables, etc.)
- Services (config, confirmation, loading, error handling)
- Animations, directives, pipes, and utilities
- TailwindCSS-based styling system

#### `src/app/core/` - Core Application Logic
- **auth/**: Authentication services, guards, interceptors, token management
- **permissions/**: Role-based access control system
- **services/**: Business logic services (claims, companies, employees, statements)
- **models/**: DTOs and interfaces for API communication

#### `src/app/modules/` - Feature Modules
- **dashboard/**: Main dashboard with company and MLA boards
- **claims/**: Claims management (list, details, create new)
- **statements/**: Financial statements (detailed, global, annexes)
- **accounting/**: Encashment, settlement, and fees management
- **admin/**: User management (MLOs, companies, employees, roles, parameters)
- **auth/**: Authentication flows (sign-in, sign-up, password reset)

#### `src/app/layout/` - Layout Components
- Vertical navigation layouts (classy, custom, thin)
- Common components (header, breadcrumbs, user menu, etc.)

### Technology Stack
- **Angular 18** with Angular Material
- **TailwindCSS** for styling
- **Transloco** for internationalization (French, English, Arabic, Senegalese)
- **ngx-charts** for data visualization
- **Quill** for rich text editing
- **Luxon/Moment** for date handling
- **Perfect Scrollbar** for custom scrollbars

### Key Patterns

#### Permission System
- All routes and navigation items use permission-based access control
- Check `src/app/core/permissions/permissions.data.ts` for available permissions
- Use `HasPermissionDirective` in templates for conditional rendering

#### Service Architecture
- Services follow a consistent pattern with interfaces and DTOs
- HTTP interceptors handle authentication and error management
- Toast notifications for user feedback

#### Navigation Structure
- Hierarchical navigation defined in `src/app/core/navigation/data.ts`
- Supports basic, group, and collapsible navigation items
- Permission-based visibility

### Internationalization
- Translation files in `src/assets/i18n/` (fr.json, en.json, ar.json, sn.json)
- Use Transloco service and pipe for translations
- Navigation and UI text are fully internationalized

### Styling Approach
- TailwindCSS as primary styling framework
- Custom SCSS in `src/@lhacksrt/styles/`
- Angular Material components with custom theming
- SCSS preprocessing with custom include paths

### Testing
- Karma + Jasmine for unit testing
- Test files use `.spec.ts` extension
- Run tests with `npm test`