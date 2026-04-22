import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit{
  private loginService = inject(LoginService);
  private router = inject(Router);
  private swPush = inject(SwPush);
  private http = inject(HttpClient);

  username = '';
  profileImage = signal<string>('');


  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loadingData = signal<boolean>(true);
  loading = false;  


    ngOnInit(): void {
        this.loadUserData();
      }

      loadUserData() {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        this.loginService.getUserProfile(userId).subscribe({
          next: (res) => {
            console.log('LA INFORMACION ES: ', res);
            // Rellenamos los signals con lo que viene de la BD
            this.username = res.username;
            this.profileImage.set(res.profile_image);
            
            // También actualizamos localStorage por si acaso
            localStorage.setItem('username', res.username);
            if (res.profile_image) {
              localStorage.setItem('profile_image', res.profile_image);
            }
            
            this.loadingData.set(false); // Ya tenemos los datos
          },
          error: (err) => {
            console.error('Error al cargar datos', err);
            this.loadingData.set(false);
          }
        });
      }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;


      // Crear previsualización local
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview =reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  saveProfile() {
    const userId = localStorage.getItem('user_id');
    if(!userId) return;

    this.loading = true; 

    this.loginService.updateProfile(userId, this.username, this.selectedFile || undefined)
      .subscribe({
        next: (res) => {
          localStorage.setItem('username', res.user.username);
          if(res.user.profile_image) {
            localStorage.setItem('profile_image', res.user.profile_image);
          }

          this.loading = false;
          alert('Perfil actualizado con exito');

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          alert('Error al actualizar el perfil');
        }
      })
  }



  // Notificacions 
  readonly VAPID_PUBLIC_KEY = "BFllqSIDKkYLQBoXiGdfp-s6zMDmxRPxDlgTufkOVmjAXAXHvJB6DjE9vJq5g1LKslCvpq7UCpCVP1YHLEJD5Oo";
suscribeUser() {
  // 1. Obtén el ID del usuario (esto es un ejemplo, usa tu lógica de login)
  const idDeTuUsuario = localStorage.getItem('user_id'); 

  if (!idDeTuUsuario) {
    console.error('No se encontró el ID del usuario');
    return;
  }

  this.swPush.requestSubscription({
    serverPublicKey: this.VAPID_PUBLIC_KEY
  })
  .then(sub => {
    // 2. Pasamos el ID dinámicamente en la URL
    this.http.post(`https://api-pareja.onrender.com/save-sub?user_id=${idDeTuUsuario}`, sub)
      .subscribe({
        next: () => {
            console.log('Suscrito con éxito');
            // Si quieres que después de suscribirse se mueva a otra pantalla:
            this.router.navigate(['/dashboard']); 
          },
          error: (err) => console.error(err)
        });
  })
  .catch(err => console.error('Error pidiendo permiso', err));
}

}
