import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';

type PermissionConfig = {
  has: string | string[];
  mode?: 'all' | 'any';
  not?: string | string[];
};

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private config: PermissionConfig = {
    has: [],
    mode: 'all',
    not: []
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
  private subscription: Subscription | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscription = this.userService.permissions$.subscribe(permissions => {
      this.currentPermissions = permissions || [];
      this.evaluatePermissions();
    });
  }

  private evaluatePermissions() {
    if (!this.currentPermissions) {
      this.viewContainer.clear();
      return;
    }

    const requiredPermissions = Array.isArray(this.config.has) 
      ? this.config.has 
      : [this.config.has];
      
    const forbiddenPermissions = this.config.not
      ? (Array.isArray(this.config.not) ? this.config.not : [this.config.not])
      : [];

    const mode = this.config.mode || 'all';
    
    const hasRequiredAccess = mode === 'all'
      ? requiredPermissions.every(perm => this.currentPermissions.includes(perm))
      : requiredPermissions.some(perm => this.currentPermissions.includes(perm));

    const hasForbiddenAccess = forbiddenPermissions.some(perm => this.currentPermissions.includes(perm));

    this.viewContainer.clear();
    if (hasRequiredAccess && !hasForbiddenAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}