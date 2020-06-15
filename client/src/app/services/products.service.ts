import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  // GET all products + products from each category 
  public getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("http://localhost:8080/api/products");
  }

  public getRings(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("http://localhost:8080/api/products/categories/5dda86187cf4b40db2764f81");
  }

  public getEarings(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("http://localhost:8080/api/products/categories/5dda862e7cf4b40db2764f9c");
  }

  public getBracelets(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("http://localhost:8080/api/products/categories/5dda863d7cf4b40db2764fa4");
  }

  public getNecklaces(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("http://localhost:8080/api/products/categories/5dda864f7cf4b40db2764fc3");
  }

  public getMenProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>("http://localhost:8080/api/products/categories/5dda865d7cf4b40db2764fd0");
  }

  public updateProduct(product_id, product): Observable<Product> {
    return this.httpClient.patch<Product>("http://localhost:8080/api/products/" + product_id, product);
  }

  public uploadImage(image: File, product: Product): Observable<Product> {
    let formData = new FormData();


    formData.append('myImage', image);
    formData.append('newProduct', JSON.stringify(product));

    return this.httpClient.post("http://localhost:8080/upload-image", formData);
  }

  public addProduct(product): Observable<Product> {
    return this.httpClient.post<Product>("http://localhost:8080/api/upload-image/", product);
  }

  public deleteProduct(product_id): Observable<Product> {
    return this.httpClient.delete<Product>("http://localhost:8080/api/products/" + product_id);
  }


}
