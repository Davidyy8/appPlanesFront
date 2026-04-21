import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connect.html',
  styleUrl: './connect.css'
})
export class ConnectComponent implements OnInit, OnDestroy {
  // Signals para el estado de la vista
  invitationCode = signal<string>(''); 
  generatedCode = signal<string | null>(null); 
  isLoading = signal<boolean>(false);
  
  private userId: number | null = null;
  private pollingSub?: Subscription;
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = this.loginService.getUserId();
      
      // Si ya hay pareja, no pintamos nada aquí, vamos directo al Dashboard
      const existingCoupleId = localStorage.getItem('couple_id');
      if (existingCoupleId && existingCoupleId !== '0' && existingCoupleId !== 'null') {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  generateNewCode() {
    if (this.userId) {
      this.isLoading.set(true);
      this.apiService.generateCode(this.userId).subscribe({
        next: (res) => {
          this.generatedCode.set(res.invitation_code);
          this.isLoading.set(false);
          this.iniciarRadarConexion(); // Empezamos a escuchar cambios
        },
        error: () => {
          this.isLoading.set(false);
          alert('Error al generar código');
        }
      });
    }
  }

  iniciarRadarConexion() {
    // Polling: cada 4 segundos preguntamos al servidor
    this.pollingSub = interval(4000).subscribe(() => {
      if (this.userId) {
        this.apiService.getUserStatus(this.userId).subscribe({
          next: (res) => {
            if (res.couple_id && res.couple_id !== 0) {
              localStorage.setItem('couple_id', res.couple_id.toString());
              this.pollingSub?.unsubscribe(); 
              this.router.navigate(['/dashboard']);
            }
          }
        });
      }
    });
  }

  vincularPareja() {
    const code = this.invitationCode().trim();
    if (this.userId && code) {
      this.apiService.connectWithCode(this.userId, code).subscribe({
        next: (res) => {
          localStorage.setItem('couple_id', res.couple_id.toString());
          this.router.navigate(['/dashboard']);
        },
        error: () => alert('Código inválido o ya caducado')
      });
    }
  }

  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }
}