import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/category';
import { ProductsService } from 'src/app/services/products.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  public connectedUser: User;
  public newProduct = new Product();
  public categories: Category[];
  public selectedFile: File;

  constructor(private router: Router, private categoriesService: CategoriesService,
    private productsService: ProductsService) { }

  ngOnInit() {
    let user = localStorage.getItem("myUser");
    if (user) {
      let loggedUser = JSON.parse(user);
      if (loggedUser.email !== "admin@admin.com") {

        this.router.navigate(["/products"]);
      }
    } else {
      this.router.navigate(["/products"]);
    }


    this.categoriesService.getAllCategories().subscribe(c => this.categories = c);
  }

  public backToShop(): void {
    this.router.navigate(["/products"]);
  }

  public setImage(event): void {
    this.selectedFile = event.target.files[0];
    const imageName = event.target.files[0].name;
    this.newProduct.img_name = imageName;
  }

  public addButton(): boolean {
    return (this.newProduct.category && this.newProduct.name && this.newProduct.price > 0 && this.newProduct.goldKarat && this.newProduct.goldType && this.newProduct.carat > 0 && this.newProduct.img_name) ?
      true : false;
  }

  public addProduct(): void {
    console.log("2423423")
    // add the product: 
    console.log("this product: ", this.newProduct);
    this.productsService.uploadImage(this.selectedFile, this.newProduct).subscribe();
    this.backToShop();

  }
}