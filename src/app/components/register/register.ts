import { Component, inject, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  // Signals para capturar los datos del nuevo usuario
  username = signal<string>('');
  password = signal<string>('');
  isLoading = signal<boolean>(false);

  private loginService = inject(LoginService);
  private router = inject(Router);

  handleRegister() {
    // Accedemos al valor del signal con ()
    if (!this.username() || !this.password()) {
      alert('Por favor, rellena todos los campos ✍️');
      return;
    }

    this.isLoading.set(true);
    this.loginService.register(this.username(), this.password()).subscribe({
      next: () => {
        this.isLoading.set(false);
        alert('¡Registro con éxito! Ahora puedes iniciar sesión 💙');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        alert('Error: el usuario ya existe o hay un problema con el servidor');
        console.error(err);
      }
    });
  }
}