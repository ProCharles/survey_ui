import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, catchError, throwError } from 'rxjs';
  
@Injectable({ 
    providedIn: 'root'
}) 
export class ApiService { 
    private baseUrl: string = 'http://localhost:3000/survey';

    constructor(private http: HttpClient) { }
    
    saveSurvey(formData: any): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            }),
        };

        return this.http
            .post<any>(`${this.baseUrl}/add`, formData, httpOptions)
            .pipe(catchError(this.handleError));
    }

    getSurveys(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}`);
    }

    private handleError(error: any): Observable<never> {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
    }
    
}
