import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  planes: any[] = [];
  nuevoPlan = { title: '', description: '', couple_id: 0 };
  coupleId: number | null = null;
  selectedFile: File | null = null;

  // Inyectamos las herramientas necesarias
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  constructor(private api: ApiService, private loginService: LoginService) {}

  ngOnInit(): void {
    // Solo accedemos a datos de sesión si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.coupleId = this.loginService.getCoupleId();
      if (this.coupleId) {
        this.nuevoPlan.couple_id = this.coupleId;
        this.cargarPlanes();
      }
    }
  }

  cargarPlanes() {
    if (!this.coupleId) return;

    this.api.getPendingPlanes(this.coupleId).subscribe({
      next: (res) => {
        this.planes = res;
        // 💡 Forzamos la detección de cambios para evitar el error NG0100
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar planes:', err)
    });
  }

  crearPlan() {
    if (!this.nuevoPlan.title.trim()) return;

    this.api.crearPlan(this.nuevoPlan).subscribe({
      next: () => {
        this.nuevoPlan.title = '';
        this.nuevoPlan.description = '';
        this.cargarPlanes();
      },
      error: (err) => console.error('Error al crear plan:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  completarPlan(planId: number) {
    if (!this.selectedFile) {
      alert('Por favor, selecciona una foto primero 📸');
      return;
    }

    this.api.completePlan(planId, this.selectedFile).subscribe({
      next: () => {
        this.selectedFile = null;
        this.cargarPlanes(); // Al recargar, este plan ya no saldrá (porque es pending)
      },
      error: (err) => console.error("Error al completar plan", err)
    });
  }
}