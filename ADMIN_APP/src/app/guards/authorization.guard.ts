import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync, Router,
  RouterStateSnapshot
} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
@Injectable()
export  class AuthorizationGuard {
  constructor(private authService : AuthService, private router : Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const userRoles: string[] = this.authService.roles || [];  // Assurez-vous que userRoles est toujours un tableau

    console.log('Is Authenticated:', this.authService.isAuthenticated);
    console.log('Expected Roles:', expectedRoles);
    console.log('User Roles:', userRoles);

    if (this.authService.isAuthenticated && (expectedRoles.some((role: string) => userRoles.includes(role)) || userRoles.includes('SuperAdmin'))) {
      return true;
    } else {
      this.router.navigate(['/admin/accessDenied']);
      return false;
    }
  }
}
