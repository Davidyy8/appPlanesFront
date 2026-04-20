import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private loginService: LoginService, private router: Router) {}

  handleLogin() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (user) => {
        if (user.couple_id) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/connect']);
        }
      },
      error: () => alert('Usuario o contraseña incorrectos')
    });
  }
}
