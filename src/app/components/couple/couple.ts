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
  // Signals para los dos miembros
  myData = signal<any>(null);
  partnerData = signal<any>(null);
  
  private platformId = inject(PLATFORM_ID);
  private api = inject(ApiService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const myId = localStorage.getItem('user_id');
      const coupleId = localStorage.getItem('couple_id');
      
      if (coupleId && coupleId !== '0') {
        this.api.getCoupleInfo(parseInt(coupleId)).subscribe({
          next: (res) => {
            // 'res.members' es la lista que devuelve tu FastAPI
            const members = res.members;

            // Buscamos quién soy yo y quién es mi pareja en el array
            const me = members.find((u: any) => u.id.toString() === myId);
            const partner = members.find((u: any) => u.id.toString() !== myId);

            this.myData.set(me);
            this.partnerData.set(partner);
          },
          error: (err) => console.error('Error al obtener info:', err)
        });
      }
    }
  }
}
