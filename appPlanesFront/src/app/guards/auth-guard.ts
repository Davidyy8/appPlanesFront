import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Verificamos si estamos en el navegador para acceder al localStorage
  if (isPlatformBrowser(platformId)) {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      // Si hay un ID de usuario, le dejamos pasar
      return true;
    }
  }

  // Si no está logueado, lo mandamos al login
  router.navigate(['/login']);
  return false;
};