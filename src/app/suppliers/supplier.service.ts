import { Supplier } from './supplier';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, Observable, of } from 'rxjs';
import { concatMap, mergeMap, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  constructor(private http: HttpClient) { }

  supplierWithConcatMap$ = of(1, 5, 8)
  .pipe(
     tap( stream => console.log( "outer stream: "+ stream)),
     //concatMap( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) ) 
     //mergeMap( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) ) 
     switchMap( id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`) ) 
     )
     .subscribe( data =>  console.log("inner stream: "+data.name) );

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
