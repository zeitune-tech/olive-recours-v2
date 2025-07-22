import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ManagementEntityType } from 'src/app/modules/admin/users/dto';

type PermissionConfig = {
  has: string | string[];
  mode?: 'all' | 'any';
  profile?: ManagementEntityType | null;
};

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private config: PermissionConfig = {
    has: [],
    mode: 'all',
    profile: null // Changed default to null (no profile requirement)
  };
 
  @Input() set hasPermission(config: PermissionConfig | string | string[]) {
    if (Array.isArray(config) || typeof config === 'string') {
      // Backward compatibility with direct array/string input
      this.config = {
        ...this.config,
        has: config as string | string[],
      };
    } else {
      this.config = {
        ...this.config,
        ...config,
      };
    }
    this.evaluatePermissions();
  }

  private currentPermissions: string[] = [];
  private currentLevel: ManagementEntityType | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscription = this.userService.level$.subscribe(level => {
      this.currentLevel = level;
      // Subscribe to permissions changes as well
      this.userService.permissions$.subscribe(permissions => {
        this.currentPermissions = permissions || [];
        this.evaluatePermissions();
      });
    });
  }

  private evaluatePermissions() {
    if (!this.currentPermissions) {
      this.viewContainer.clear();
      return;
    }

    // Check profile requirement first
    if (!this.checkProfileRequirement()) {
      this.viewContainer.clear();
      return;
    }

    const requiredPermissions = Array.isArray(this.config.has)
      ? this.config.has
      : [this.config.has];

    const mode = this.config.mode || 'all';
   
    const hasRequiredAccess = mode === 'all'
      ? requiredPermissions.every(perm => this.currentPermissions.includes(perm))
      : requiredPermissions.some(perm => this.currentPermissions.includes(perm));

    this.viewContainer.clear();
    if (hasRequiredAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkProfileRequirement(): boolean {
    // If no profile requirement is specified, allow any profile
    if (this.config.profile === null || this.config.profile === undefined) {
      return true;
    }

    // If MarketLevelOrganization is required, user must have MarketLevelOrganization
    if (this.config.profile === ManagementEntityType.MARKET_LEVEL_ORGANIZATION) {
      return this.currentLevel === ManagementEntityType.MARKET_LEVEL_ORGANIZATION;
    }

    // If Company is required, user must have Company
    if (this.config.profile === ManagementEntityType.COMPANY) {
      return this.currentLevel === ManagementEntityType.COMPANY;
    }

    // For any other specific profile requirement, check exact match
    return this.currentLevel === this.config.profile;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}