import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, tap } from "rxjs";


export interface UserResponse {
    id: number,
    username: string,
    couple_id: number | null
}

@Injectable({
    providedIn: 'root'
})

export class LoginService {

    private baseUrl = 'http://127.0.0.1:8000'
    constructor (private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {  }

    register(username: string, password: string): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.baseUrl}/register`, {username, password});
    }

    login(username: string, password: string): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.baseUrl}/login`, {username, password}).pipe(
            tap(user => {
                localStorage.setItem('user_id', user.id.toString());
                localStorage.setItem('username', user.username);
                if (user.couple_id) {
                    localStorage.setItem('couple_id', user.couple_id.toString());
                }
            })
        );

    }

    getUserId(): number | null {
    // Comprobamos si 'window' existe (estamos en el navegador)
    if (typeof window !== 'undefined' && window.localStorage) {
        const id = localStorage.getItem('user_id');
        return id ? parseInt(id) : null;
    }
    return null; // Si estamos en el servidor, devolvemos null
    }

    getCoupleId(): number | null {
        // Solo ejecuta esto si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
        const id = localStorage.getItem('couple_id');
        return id ? parseInt(id) : null;
        }
        return null;
    }

    logout() {
        localStorage.clear();
    }

}