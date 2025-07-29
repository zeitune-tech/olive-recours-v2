import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FeeRequest, FeeResponse, ModeEncaissementRequest, ModeEncaissementResponse } from './params.dto';

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
export class ParamsService {
  private readonly request_url = environment.request_url + '/closure';
  private readonly fees_url = environment.request_url + '/fees';
  private closure: BehaviorSubject<ClosureResponse | null> = new BehaviorSubject<ClosureResponse | null>(null);
  private currentFee: BehaviorSubject<FeeResponse | null> = new BehaviorSubject<FeeResponse | null>(null);
  private readonly modesEncaissement_url = environment.request_url + '/mode-encaissement';
private modesEncaissement: BehaviorSubject<ModeEncaissementResponse[]> = new BehaviorSubject<ModeEncaissementResponse[]>([]);

  constructor(private http: HttpClient) {}

  // Closure methods (unchanged)
  get closure$(): Observable<ClosureResponse | null> {
    return this.closure.asObservable();
  }

  setClosure(closure: ClosureResponse | null) {
    this.closure.next(closure);
  }

  fetchClosure(): Observable<ClosureResponse | null> {
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

  // Fee methods
  get currentFee$(): Observable<FeeResponse | null> {
    return this.currentFee.asObservable();
  }

  setCurrentFee(fee: FeeResponse | null) {
    this.currentFee.next(fee);
  }

  fetchCurrentFee(): Observable<FeeResponse | null> {
    return this.currentFee$;
  }

  getCurrentFee(): Observable<FeeResponse | null> {
    return this.http.get<FeeResponse | null>(`${this.fees_url}/current`).pipe(
      tap((response) => {
        this.setCurrentFee(response);
      })
    );
  }

  getAllFees(): Observable<FeeResponse[]> {
    return this.http.get<FeeResponse[]>(this.fees_url);
  }

  deleteAllFees(): Observable<void> {
    return this.http.delete<void>(this.fees_url+"/all");
  }

  getFeeByDate(date: string): Observable<FeeResponse | null> {
    return this.http.get<FeeResponse | null>(`${this.fees_url}/by-date?date=${date}`);
  }

  createFee(request: FeeRequest): Observable<FeeResponse> {
    return this.http.post<FeeResponse>(this.fees_url, request).pipe(
      tap((response) => {
        this.setCurrentFee(response);
        return response;
      })
    );
  }

  updateFee(request: FeeRequest): Observable<FeeResponse> {
    return this.http.put<FeeResponse>(this.fees_url, request).pipe(
      tap((response) => {
        this.setCurrentFee(response);
        return response;
      })
    );
  }

  // Mode encaissement methods
  get modesEncaissement$(): Observable<ModeEncaissementResponse[]> {
    return this.modesEncaissement.asObservable();
  }

  setModesEncaissement(modes: ModeEncaissementResponse[]) {
    this.modesEncaissement.next(modes);
  }

  getModesEncaissement(): Observable<ModeEncaissementResponse[]> {
    return this.http.get<ModeEncaissementResponse[]>(this.modesEncaissement_url).pipe(
      tap((response) => {
        this.setModesEncaissement(response);
      })
    );
  }
  
  getModeEncaissementByUuid(uuid: string): Observable<ModeEncaissementResponse> {
    return this.http.get<ModeEncaissementResponse>(`${this.modesEncaissement_url}/${uuid}`);
  }
  
  createModeEncaissement(request: ModeEncaissementRequest): Observable<ModeEncaissementResponse> {
    return this.http.post<ModeEncaissementResponse>(this.modesEncaissement_url, request).pipe(
      tap((response) => {
        // Recharger la liste après création
        this.getModesEncaissement().subscribe();
      })
    );
  }
  
  updateModeEncaissement(uuid: string, request: ModeEncaissementRequest): Observable<ModeEncaissementResponse> {
    return this.http.put<ModeEncaissementResponse>(`${this.modesEncaissement_url}/${uuid}`, request).pipe(
      tap((response) => {
        // Recharger la liste après mise à jour
        this.getModesEncaissement().subscribe();
      })
    );
  }
  
  deleteModeEncaissement(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.modesEncaissement_url}/${uuid}`).pipe(
      tap(() => {
        // Recharger la liste après suppression
        this.getModesEncaissement().subscribe();
      })
    );
  }
  
}