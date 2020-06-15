import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { NgRedux } from 'ng2-redux';
import { AppState } from 'src/app/redux/appState';
import { CartsService } from 'src/app/services/carts.service';
import { Category } from 'src/app/models/category';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category-products-admin',
  templateUrl: './category-products-admin.component.html',
  styleUrls: ['./category-products-admin.component.css']
})
export class CategoryProductsAdminComponent implements OnInit {

  @Input() product: any;
  @Input() user: User;
  @Input() category: Category;
  public myCart: any;
  public name: any;
  public price: number;

  public constructor(private redux: NgRedux<AppState>, private cartsService: CartsService,
    private productsService: ProductsService) { }

  ngOnInit() {
    if (this.redux.getState().cart) {
      this.myCart = this.redux.getState().cart;
    }

    this.cartsService.getCartFromUser(this.user._id).subscribe(myCart => {
      this.myCart = myCart;
    });

    this.name = this.product.name;
    this.price = this.product.price;
  }

  public update(): void {
    if (this.product.sale > this.product.price) {
      alert("Sale Price is bigger than Real Price! Please Change it and update again.");
      return;
    }
    if (!this.product.sale) {
      this.product.sale = null;
    }
    if (this.product.sale < 0) {
      alert("Sale Price is lower than zero(0)! Please Change it and update again.");
      return;
    }
    const newProduct = this.product;
    const id = this.product._id;
    this.productsService.updateProduct(id, newProduct).subscribe(p =>
      alert("Product has been updated successfully."),
      err => console.log(err)
    );
  }
  public delete(): void {
    this.productsService.deleteProduct(this.product._id).subscribe(p =>
      alert("Product has been deleted."),
      err => console.log(err)
    );
  }
}
