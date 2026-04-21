import { Component, inject, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  // Signals para capturar las credenciales
  username = signal<string>('');
  password = signal<string>('');
  isLoading = signal<boolean>(false);

  private loginService = inject(LoginService);
  private router = inject(Router);

  handleLogin() {
    if (!this.username() || !this.password()) return;

    this.isLoading.set(true);
    this.loginService.login(this.username(), this.password()).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        // Redirección inteligente
        if (user.couple_id && user.couple_id !== 0) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/connect']);
        }
      },
      error: () => {
        this.isLoading.set(false);
        alert('Usuario o contraseña incorrectos ❌');
      }
    });
  }
}