import { catchError, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { EMPTY, Observable, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  //selectedCategoryId = 0;
  selectedCategorySubject = new BehaviorSubject<number>(0);
  selectedCategoryAction = this.selectedCategorySubject.asObservable();
  
  constructor(private productService: ProductService, private  productCategoryService: ProductCategoryService) {
    //this.product$.subscribe( data => {debugger;} )
   }

   //product$ = this.productService.product$.pipe( map( products => products.filter( p => p.categoryId == this.selectedCategoryId ) ) );
   categories$ = this.productCategoryService.productCategories$;
  //sub: Subscription;
  
  productStream$ = this.productService.product$;
  
  product$ = combineLatest([this.productStream$, this.selectedCategoryAction])
  .pipe( map( ([products, categoryId]) => products.filter( product => categoryId ? product.categoryId == categoryId: true  )));

  onSelected(categoryId: string){
    this.selectedCategorySubject.next(+categoryId);
   }

  // ngOnInit(): void {
  //   this.product$ = this.productService.getProducts()
  //   .pipe( 
  //     catchError( err => 
  //       { 
  //         this.errorMessage = err; 
  //         return EMPTY; 
  //       } ) )
  //     // .subscribe(
  //     //   products => this.products = products,
  //     //   error => this.errorMessage = error
  //     // );
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    this.productService
    .addProduct( { id: 33, productName: 'New Arrival', categoryId: 1, price: 10 } as Product );
  }
}
