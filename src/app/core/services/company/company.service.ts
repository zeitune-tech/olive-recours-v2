import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Company } from "./company.interface";

@Injectable()
export class CompanyService {

    baseUrl = environment.request_url + '/companies';
    private _company: ReplaySubject<Company> = new ReplaySubject<Company>(1);
    private _myCompany: ReplaySubject<Company> = new ReplaySubject<Company>(1);
    private _companies: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);

    private _metadata: ReplaySubject<any> = new ReplaySubject<any>(1);
        

    set company(value: Company) {
        this._company.next(value);
    }

    get company$() {
        return this._company.asObservable();
    }

    set myCompany(value: Company) {
        this._myCompany.next(value);
    }

    get myCompany$() {
        return this._myCompany.asObservable();
    }

    set companies(value: Company[]) {
        this._companies.next(value);
    }

    get companies$() {
        return this._companies.asObservable();
    }

    set metadata(value: any) {
        this._metadata.next(value);
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }

    create(company: any): Observable<Company> {
        return this._httpClient.post<Company>(`${this.baseUrl}`, company)
        .pipe(
            tap((company) => {
                this.company = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }

    getMyCompany(): Observable<Company> {
        return this._httpClient.get<Company>(`${this.baseUrl}/me`)
        .pipe(
            tap((company) => {
                this.myCompany = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }


    getCompany(id: string): Observable<Company> {
        return this._httpClient.get<Company>(`${this.baseUrl}/${id}`)
        .pipe(
            tap((company) => {
                this.company = company;
                return (company);
            }),
            catchError(() => of({} as Company))
        );
    }


    getCompaniesAll(): Observable<Company[]> {
        return this._httpClient.get<Company[]>(`${this.baseUrl}`)
        .pipe(
            tap((response : Company[]) => {
                this.companies = response;
                return (response);
            }),
            catchError(() => of([] as Company[]))
        );
    }
}