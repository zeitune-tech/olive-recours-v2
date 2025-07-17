import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input() hasPermission!: string | string[]; // Permission(s) requise(s)
  @Input() hasPermissionMode: 'all' | 'any' = 'all'; // Mode : toutes ou au moins une permission
  private subscription: Subscription | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    // S'abonner aux changements de permissions
    this.subscription = this.userService.permissions$.subscribe(permissions => {
      this.checkPermission(permissions);
    });
  }

  private checkPermission(permissions: string[]) {
    const requiredPermissions = Array.isArray(this.hasPermission)
      ? this.hasPermission
      : [this.hasPermission];

    let hasAccess: boolean;

    if (this.hasPermissionMode === 'all') {
      // Vérifie si l'utilisateur possède TOUTES les permissions requises
      hasAccess = requiredPermissions.every(perm => permissions.includes(perm));
    } else {
      // Vérifie si l'utilisateur possède AU MOINS UNE des permissions requises
      hasAccess = requiredPermissions.some(perm => permissions.includes(perm));
    }

    // Afficher ou masquer l'élément
    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy() {
    // Nettoyer l'abonnement
    this.subscription?.unsubscribe();
  }
}