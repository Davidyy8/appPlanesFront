import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router'; // Importamos RouterLink
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
  username = '';
  password = '';

  constructor(private loginService: LoginService, private router: Router) {}

  handleRegister() {
    if (!this.username || !this.password) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    this.loginService.register(this.username, this.password).subscribe({
      next: () => {
        alert('Registro con éxito, ahora inicia sesión');
        this.router.navigate(['/login']); // Redirigimos al login tras registrarse
      },
      error: (err) => alert('Error en el registro: el usuario ya existe o hay un problema con el servidor')
    });
  }
}