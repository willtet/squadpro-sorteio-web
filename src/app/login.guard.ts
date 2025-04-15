import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const loginGuard = () => {
  const router = inject(Router);


  const isLoggedIn = !!localStorage.getItem('authToken');

  if (isLoggedIn) {
    router.navigate(['/sorteio']);
    return false;
  }

  return true;
};
