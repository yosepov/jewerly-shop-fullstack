import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { NgRedux } from 'ng2-redux';
import { AppState } from 'src/app/redux/appState';
import { User } from 'src/app/models/user';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public products: Product[];
  public connectedUser: User;
  public categories: Category[];
  public category: Category;
  public search: any;
  public displayCart: string;
  public mainClass: string;
  public isAdmin: boolean;

  public constructor(private title: Title, private productsService: ProductsService, private redux: NgRedux<AppState>,
    private categoriesService: CategoriesService, private router: Router) { }

  public ngOnInit() {

    console.log(this.redux.getState().logged);
    this.title.setTitle("Rings");
    const fromLocal = localStorage.getItem("myUser");
    if (fromLocal) {
      this.redux.getState().logged = JSON.parse(fromLocal);
    }
    this.connectedUser = this.redux.getState().logged;

    // get the category
    this.categoriesService.getAllCategories().subscribe(c => {
      this.categories = c
      this.categories.map(c => c.category === "Rings" ? this.category = c : this.category);
    });

    // Gettin all the products from the service
    this.productsService.getRings().subscribe(products => {
      this.products = products,
        console.log(this.products)
    },
      err => {
        alert("Error: " + err.message);
      })

    let adminCondition = this.connectedUser.email === "admin@admin.com";
    this.displayCart = adminCondition ? "none" : "block";
    this.mainClass = adminCondition ? "adminMain" : "deafultMain";
    this.isAdmin = adminCondition ? true : false;
  }

  public addPage(): void {
    this.router.navigate(["/addProduct"]);
  }

  public getAllProducts(): void {
    this.productsService.getAllProducts().subscribe(products => {
      if (this.search) {
        this.products = products.filter((product) => {
          return product.name.toLowerCase().indexOf(this.search) > -1
        });
        if (!this.products) {
          this.products = products;
          return;
        }
        return;
      }
      err => {
        alert("Error: " + err.message);
      }
    });
  }

  public getRings(): void {

    this.productsService.getRings().subscribe(products => {
      this.products = products,
        console.log(this.products)
    },
      err => {
        alert("Error: " + err.message);
      });
  }


  public getEarings(): void {
    this.productsService.getEarings().subscribe(products => {
      this.products = products,
        console.log(this.products)
    },
      err => {
        alert("Error: " + err.message);
      })
  }


  public getBracelets(): void {
    this.productsService.getBracelets().subscribe(products => {
      this.products = products,
        console.log(this.products)
    },
      err => {
        alert("Error: " + err.message);
      })
  }


  public getNecklaces(): void {
    this.productsService.getNecklaces().subscribe(products => {
      this.products = products,
        console.log(this.products)
    },
      err => {
        alert("Error: " + err.message);
      })
  }


  public getMenProducts(): void {
    this.productsService.getMenProducts().subscribe(products => {
      this.products = products,
        console.log(this.products)
    },
      err => {
        alert("Error: " + err.message);
      })
  }

  public logout(): void {
    if (window.confirm('Are you sure you wish to log out?') === true) {
      localStorage.removeItem('myUser');
      localStorage.removeItem('myCart');
      this.redux.getState().logged = undefined;
      this.redux.getState().cart = undefined;
      this.router.navigate(["/login"]);
    }
  }


}