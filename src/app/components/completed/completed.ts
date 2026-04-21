import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed.html',
  styleUrl: './completed.css',
})
export class CompletedComponent implements OnInit {
  // Signals: la fuente de la verdad para la vista
  completedplans = signal<any[]>([]);
  loading = signal<boolean>(true);
  
  private coupleId: number | null = null;
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = localStorage.getItem('couple_id');
      if (id) {
        this.coupleId = parseInt(id);
        this.loadComplete();
      }
    }
  }

  loadComplete() {
    if (!this.coupleId) return;

    this.apiService.getCompletedPlanes(this.coupleId).subscribe({
      next: (res) => {
        // Actualizamos los signals
        this.completedplans.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Error al cargar recuerdos:', err);
      }
    });
  }
}