import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; 
import { LoginService } from '../../services/login.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  public loginService = inject(LoginService);

  // Signal para el nombre de usuario
  username = signal<string | null>(null);

  ngOnInit(): void {
    this.checkUser();
  }

  // Función para actualizar los datos del usuario logueado
  checkUser() {
    if (isPlatformBrowser(this.platformId)) {
      const name = localStorage.getItem('username');
      this.username.set(name);
    }
  }

  isLogged(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('user_id');
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.username.set(null); // Limpiamos el signal
      this.router.navigate(['/login']);
    }
  }
}