import { ProductCategoryService } from './../product-categories/product-category.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, merge, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, scan, shareReplay, tap } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private productCategoryService: ProductCategoryService) { }

  dbProduct$ = this.http.get<Product[]>(this.productsUrl)
      .pipe(
        map( products => products.map( prod => ({ ...prod, price: prod.price * 1.5 } as Product ))),
        tap(data => console.log('Products: ', JSON.stringify(data))),
        catchError(this.handleError)
      );

  private newProduct$ = new Subject<Product>();

  product$ = merge(this.dbProduct$, this.newProduct$)
  .pipe( scan( (acc: Product[], newProd: Product) => [...acc, newProd] ), shareReplay(1) );

  addProduct(newProd: Product){
    this.newProduct$.next(newProd);
  }

      private productSelectedSubject = new BehaviorSubject<number>(0);
      productSelectedAction = this.productSelectedSubject.asObservable();

      selectedProduct$ = combineLatest([this.product$, this.productSelectedSubject])
      .pipe( 
        map( ([products, selectedProductId]) => 
          products.find( p => p.categoryId == selectedProductId ) 
        ));

        selectedProductChanged(productId: number){
          this.productSelectedSubject.next(productId);
        }

      // productsWithCategory$ = combineLatest([this.product$, this.productCategoryService.productCategories$])
      // .pipe( 
      //   map(([products, categ]) => 
      //   { 
      //     products.map( product => { return {...product, category: categ.find( c => c.id == product.categoryId ).name} } ) 
      //   }));

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30
    };
  }

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
