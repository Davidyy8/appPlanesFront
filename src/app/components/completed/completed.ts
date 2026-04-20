import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'; // 1. Importa ChangeDetectorRef
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
  completedplans: any[] = [];
  coupleId: number | null = null;
  loading: boolean = true;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef); // 2. Inyecta el detector de cambios

  constructor(private apiService: ApiService) {}

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
    this.apiService.getCompletedPlanes(this.coupleId!).subscribe({
      next: (res) => {
        this.completedplans = res;
        this.loading = false;
        
        // 3. Forzamos la detección de cambios para que Angular sepa 
        // que la longitud de la lista ha cambiado de 6 a 7 (o lo que sea)
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }
}