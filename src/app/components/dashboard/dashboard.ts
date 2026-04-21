import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { LoginService } from '../../services/login.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Signals para reactividad moderna
  planes = signal<any[]>([]);
  coupleId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  
  // Estado del formulario
  nuevoPlan = { title: '', description: '', couple_id: 0 };
  selectedFile: File | null = null;
  selectedFileId: number | null = null; // Corregido: para saber qué plan tiene la foto
  userId: number | null = null;

  private pollingSub?: Subscription;
  private platformId = inject(PLATFORM_ID);
  private api = inject(ApiService);
  private loginService = inject(LoginService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = this.loginService.getUserId();
      const id = this.loginService.getCoupleId();
      
      if (id && id !== 0) {
        this.coupleId.set(id);
        this.nuevoPlan.couple_id = id;
        this.cargarPlanes();
        this.iniciarRadarPlanes();
      } else {
        this.iniciarRadarPareja();
      }
    }
  }

  iniciarRadarPareja() {
    this.pollingSub = interval(5000).subscribe(() => {
      if (this.userId) {
        this.api.getUserStatus(this.userId).subscribe(res => {
          if (res.couple_id && res.couple_id !== 0) {
            localStorage.setItem('couple_id', res.couple_id.toString());
            this.coupleId.set(res.couple_id);
            this.nuevoPlan.couple_id = res.couple_id;
            this.pollingSub?.unsubscribe();
            this.cargarPlanes();
            this.iniciarRadarPlanes();
          }
        });
      }
    });
  }

  iniciarRadarPlanes() {
    // Actualiza la lista cada 15 segundos por si tu pareja añade algo
    this.pollingSub = interval(15000).subscribe(() => this.cargarPlanes());
  }

  cargarPlanes() {
    const id = this.coupleId();
    if (!id) return;
    this.api.getPendingPlanes(id).subscribe({
      next: (res) => this.planes.set(res),
      error: (err) => console.error('Error:', err)
    });
  }

  crearPlan() {
    if (!this.nuevoPlan.title.trim()) return;
    this.api.crearPlan(this.nuevoPlan).subscribe({
      next: (plan) => {
        this.planes.update(p => [...p, plan]);
        this.nuevoPlan.title = '';
        this.nuevoPlan.description = '';
      }
    });
  }

  onFileSelected(event: any, planId: number) {
    this.selectedFile = event.target.files[0];
    this.selectedFileId = planId;
  }

  completarPlan(planId: number) {
    if (!this.selectedFile || this.selectedFileId !== planId) {
      alert('Selecciona una foto para este plan 📸');
      return;
    }
    this.isLoading.set(true);
    this.api.completePlan(planId, this.selectedFile).subscribe({
      next: () => {
        this.selectedFile = null;
        this.selectedFileId = null;
        this.cargarPlanes();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  eliminarPlan(planId: number) {
    if (confirm('¿Quieres borrar este plan? 🗑️')) {
      this.api.eliminarPlan(planId).subscribe({
        next: () => this.planes.update(p => p.filter(item => item.id !== planId))
      });
    }
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }
}