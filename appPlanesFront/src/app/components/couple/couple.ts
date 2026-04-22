import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-couple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './couple.html',
  styleUrl: './couple.css'
})
export class CoupleComponent implements OnInit {
  // Signals para manejar el estado de la conexión
  coupleData = signal<any>(null);
  myUsername = signal<string | null>(null);
  
  private platformId = inject(PLATFORM_ID);
  private api = inject(ApiService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Leemos los datos iniciales del localStorage
      this.myUsername.set(localStorage.getItem('username'));
      const coupleId = localStorage.getItem('couple_id');
      
      if (coupleId && coupleId !== '0') {
        this.api.getCoupleInfo(parseInt(coupleId)).subscribe({
          next: (res) => {
            // Actualizamos el signal con la info recibida
            this.coupleData.set(res);
          },
          error: (err) => console.error('Error al obtener info de pareja:', err)
        });
      }
    }
  }
}