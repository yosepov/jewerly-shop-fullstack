import { Component, Input, OnInit } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { AppState } from 'src/app/redux/appState';
import { CartsService } from 'src/app/services/carts.service';
import { User } from 'src/app/models/user';
import { ActionType } from 'src/app/redux/actionType';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {

  @Input() product: Product;
  @Input() user: User;
  public totalPrice: number = 0;
  public quantity: number = 1;
  public myCart: any;
  public todayDateString: string;

  public constructor(private redux: NgRedux<AppState>, private cartsService: CartsService) { }

  ngOnInit() {
    if (this.redux.getState().cart) {
      this.myCart = this.redux.getState().cart;
    }

    this.cartsService.getCartFromUser(this.user._id).subscribe(myCart => {
      this.myCart = myCart;
    });

    // get today date string
    let today = new Date();
    let day = new String(today.getDate());
    let mon = new String(today.getMonth() + 1);
    let yr = today.getFullYear();

    if (day.length < 2) { day = "0" + day; }
    if (mon.length < 2) { mon = "0" + mon; }

    let date = day + '/' + mon + '/' + yr;
    this.todayDateString = date;
  }

  public calcValue($event): void {
    this.quantity = +$event.target.value;
  }

  public openNewCart() {
    const newCart = {
      user: this.user._id,
      date: this.todayDateString
    }
    this.cartsService.addCart(newCart).subscribe(cart => {
      this.myCart = [
        { _id: cart._id, user: cart.user, date: cart.date }
      ]
    });
  }

  public async addToCart() {
    if (this.myCart) {
      if (this.product.sale && this.product.sale > 0) {

        this.totalPrice = this.quantity * this.product.sale;
      } else {
        this.totalPrice = this.quantity * this.product.price;

      }
      const newCartItem = {
        product: this.product._id,
        amount: this.quantity,
        general_price: this.totalPrice,
        shopping_cart: this.myCart[0]._id
      }
      await this.cartsService.addCartItem(newCartItem, this.myCart[0]._id).subscribe(() => {
        this.cartsService.getCartItemsFromCart(this.myCart[0]._id).subscribe(ci => {
          const lastItem = ci[ci.length - 1];
          const action = { type: ActionType.addCartItem, lastItem };
          this.redux.dispatch(action);
          this.redux.getState().cartItems[ci.length - 1] = lastItem;
          this.redux.getState().totalPrice += lastItem.general_price;
          this.redux.getState().orderBtn = false;
        });
      });
    }
  }

  public increaseQuantity(): void {
    this.quantity += 1;
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

  public decreaseQuantity(): void {
    this.quantity -= 1;
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }

}
