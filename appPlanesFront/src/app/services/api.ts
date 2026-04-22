import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
  // private  baseUrl = 'http://127.0.0.1:8000';
  private baseUrl = 'https://api-pareja.onrender.com';
  constructor (private http : HttpClient) {}


  getPlanes(coupleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/plans/${coupleId}`);
  }

  crearPlan(planData: any) {
    return this.http.post(`${this.baseUrl}/plans`, planData);
  }

  // Enviar la foto al backend
  completePlan(planId: number, file: File){
    const formData = new FormData();
    formData.append('file', file);

    return this.http.patch(`${this.baseUrl}/plans/${planId}/complete`, formData);
  }
  // Generar un nuevo vínculo/pareja
  createCouple(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/couple/create?user_id=${userId}`, {});
  }

  // Unirse a una pareja existente con código
  joinCouple(userId: number, inviteCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/couple/join?user_id=${userId}&invite_code=${inviteCode}`, {});
  }

    // Generar el código temporal en el perfil del usuario
  generateCode(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/couple/generate-code?user_id=${userId}`, {});
  }

  // Enviar el código del otro para crear la pareja
  connectWithCode(userBId: number, code: string): Observable<any> {
    // Pasamos el código como query param o en el body según tu backend
    return this.http.post(`${this.baseUrl}/couple/connect?user_b_id=${userBId}&code=${code}`, {});
  }

  getPendingPlanes(coupleId: number): Observable<[]> {
  return this.http.get<[]>(`${this.baseUrl}/plans/${coupleId}/pending`);
}

getCompletedPlanes(coupleId: number): Observable<[]> {
  return this.http.get<[]>(`${this.baseUrl}/plans/${coupleId}/completed`);
}

getCoupleInfo(coupleId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/couple/info/${coupleId}`);
}

getUserStatus(userId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/users/me/${userId}`);
}

eliminarPlan(planId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/plans/${planId}`);
}
}
