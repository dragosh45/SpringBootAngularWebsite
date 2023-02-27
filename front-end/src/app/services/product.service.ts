//import { HttpClient } from '@angular/common/http';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/products-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  //private baseUrl = 'http://localhost:8080/api/products?size=100';
  private categoryUrl = 'http://localhost:8080/api/products-category';


  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    // build url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    // call backend api based on url - no methid created here
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {

    //build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl); 
  }
  getProductList(theCategoryId: number): Observable<Product[]> {

    //build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProdcuts(searchUrl); 
  }

  searchProducts(theSearchKeyword: string): Observable<Product[]> {
    //build URL based on the keyword
    const seearchURL = `${this.baseUrl}/search/findByNameContaining?name=${theSearchKeyword}`;

    return this.getProdcuts(seearchURL);    
  }
  searchProductPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    //build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl); 
  }
  //uses interface bellow to get the embedded entities
  private getProdcuts(seearchURL: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(seearchURL).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
      );
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number,
    totalPages: number,
    number: number
  }
}
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
