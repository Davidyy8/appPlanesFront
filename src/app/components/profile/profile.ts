import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit{
  private loginService = inject(LoginService);
  private router = inject(Router);

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


}
