import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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
  invitationCode: string = ''; 
  generatedCode: string | null = null; 
  userId: number | null = null;
  
  private pollingSub?: Subscription; // El "radar"
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private apiService: ApiService, 
    private loginService: LoginService, 
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = this.loginService.getUserId();
      
      // Si el usuario ya tiene pareja en el localStorage, mandarlo al dashboard directo
      const existingCoupleId = localStorage.getItem('couple_id');
      if (existingCoupleId && existingCoupleId !== '0' && existingCoupleId !== 'null') {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  // ACCIÓN A: Generar código y empezar a escuchar
  generateNewCode() {
    if (this.userId) {
      this.apiService.generateCode(this.userId).subscribe({
        next: (res) => {
          this.generatedCode = res.invitation_code;
          this.iniciarRadarConexion(); // <--- Empezamos a preguntar si ya se unieron
          this.cdr.detectChanges();
        },
        error: (err) => alert('Error al generar código')
      });
    }
  }

  iniciarRadarConexion() {
    // Preguntamos cada 4 segundos si el usuario ya tiene un couple_id asignado
    this.pollingSub = interval(4000).subscribe(() => {
      if (this.userId) {
        this.apiService.getUserStatus(this.userId).subscribe({
          next: (res) => {
            if (res.couple_id && res.couple_id !== 0) {
              // ¡Bingo! La pareja metió el código
              localStorage.setItem('couple_id', res.couple_id.toString());
              this.pollingSub?.unsubscribe(); 
              this.router.navigate(['/dashboard']);
            }
          }
        });
      }
    });
  }

  // ACCIÓN B: Meter el código que generó la pareja (El usuario que NO genera el código)
  vincularPareja() {
    if (this.userId && this.invitationCode) {
      this.apiService.connectWithCode(this.userId, this.invitationCode).subscribe({
        next: (res) => {
          localStorage.setItem('couple_id', res.couple_id.toString());
          this.router.navigate(['/dashboard']);
        },
        error: (err) => alert('Código inválido o ya caducado')
      });
    }
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }
}