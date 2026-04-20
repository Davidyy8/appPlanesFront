import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'; // 1. Añadimos ChangeDetectorRef
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
  coupleData: any = null;
  myUsername: string | null = null;
  
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectamos el detector

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const coupleId = localStorage.getItem('couple_id');
      this.myUsername = localStorage.getItem('username');
      
      if (coupleId) {
        this.api.getCoupleInfo(parseInt(coupleId)).subscribe({
          next: (res) => {
            this.coupleData = res;
            // 3. Le decimos a Angular: "Oye, ya tengo los datos, actualiza ahora"
            this.cdr.detectChanges(); 
          },
          error: (err) => console.error('Error al obtener info de pareja:', err)
        });
      }
    }
  }
}