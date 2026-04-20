import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Importante para el SSR
import { LoginService } from '../../services/login.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  // Inyectamos el ID de la plataforma
  private platformId = inject(PLATFORM_ID);

  constructor(public loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  // Versión segura de isLogged
  isLogged(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('user_id');
    }
    return false;
  }

  // Versión segura de logout
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}