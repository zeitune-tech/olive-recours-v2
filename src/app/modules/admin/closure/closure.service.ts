import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface ClosureRequest {
  exercise: number;
  month: number;
}

export interface ClosureResponse {
  id: number;
  exercise: number;
  month: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClosureService {
  private readonly request_url = environment.request_url + '/closure';
  private closure: BehaviorSubject<ClosureResponse | null> = new BehaviorSubject<ClosureResponse | null>(null);

  constructor(private http: HttpClient) {}

  get closure$(): Observable<ClosureResponse | null> {
    return this.closure.asObservable();
  }

  setClosure(closure: ClosureResponse | null) {
    this.closure.next(closure);
  }

  fetchClosure(): Observable<ClosureResponse | null> {
    // There is no GET endpoint, so this is a placeholder if needed in the future
    return this.closure$;
  }

  getClosure(): Observable<ClosureResponse | null> {
    return this.http.get<ClosureResponse | null>(this.request_url).pipe(
      tap((response) => {
        this.setClosure(response);
      })
    );
  }

  createClosure(request: ClosureRequest): Observable<ClosureResponse> {
    return this.http.post<ClosureResponse>(this.request_url, request).pipe(
      tap((response) => {
        this.setClosure(response);
        return response;
      })
    );
  }

  updateClosure(request: ClosureRequest): Observable<ClosureResponse> {
    return this.http.put<ClosureResponse>(this.request_url, request).pipe(
      tap((response) => {
        this.setClosure(response);
        return response;
      })
    );
  }

  deleteClosure(): Observable<void> {
    return this.http.delete<void>(this.request_url).pipe(
      tap(() => {
        this.setClosure(null);
      })
    );
  }
}
