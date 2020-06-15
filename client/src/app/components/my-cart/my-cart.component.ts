import { Component, OnInit, Input } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { AppState } from 'src/app/redux/appState';
import { Router } from '@angular/router';
import { CartsService } from 'src/app/services/carts.service';
import { User } from 'src/app/models/user';
import { Cart } from 'src/app/models/cart';
import { Order } from 'src/app/models/order';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ActionType } from 'src/app/redux/actionType';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {

  @Input() user: User;
  public cart: Cart;
  public cartItems: any;
  public categoryName: string;
  public overallPrice: number = 0;
  public order: Order;
  public orderBtn: boolean = true;

  constructor(public redux: NgRedux<AppState>, private router: Router, private cartsService: CartsService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit() {
    this.cartItems = this.redux.getState().cartItems;
    this.cart = this.redux.getState().cart;
    this.overallPrice = this.redux.getState().totalPrice ? this.redux.getState().totalPrice : 0;
    console.log("this.overallPrice: " + this.overallPrice);

    if (!this.cart || !this.cartItems) {
      // get cart id from our user
      this.cartsService.getCartFromUser(this.user._id).subscribe(async cart => {
        this.cart = cart;
        this.redux.getState().cart = this.cart;
        // get all cart items from our cart
        if (this.user.email != "admin@admin.com") {
          console.log(this.cart[0]);
          await this.websocketService.emit("call-cart-items", this.cart[0]._id);
          await this.cartsService.getCartItemsFromCart(this.cart[0]._id).subscribe(cartItems => {
            this.cartItems = cartItems;
            this.redux.getState().cartItems = cartItems;
            // make the order button available if there are cart items
            this.cartItems.length > 0 ? this.orderBtn = false : this.orderBtn = true;
            // get the price of all the cart
            this.cartItems.forEach(c => {
              
              this.overallPrice += c.general_price;
              this.redux.getState().totalPrice = this.overallPrice;
            });
            setInterval(() => {
              this.overallPrice = this.redux.getState().totalPrice;
            }, 300)
          });
          err => {
            alert("Error: " + err.message);
          }
        }
      });

    }
    if (this.cart && this.cartItems) {
      this.cartItems.length > 0 ? this.orderBtn = false : this.orderBtn = true;
      this.websocketService.listen("call-cart-items").subscribe(items => {
        this.cartItems = items;
      });

    }
    setTimeout(() => {
      if (this.cartItems) {
        console.log("for order: ", this.redux.getState().cartItems);
        setInterval(() => {
          this.overallPrice = this.redux.getState().totalPrice;
        }, 300)
      }
    }, 500)

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

  public deleteAllCartItems(): void {
    if (window.confirm('Delete all the products in the cart?') === true) {
      this.cartsService.deleteAllCartItems(this.cart[0]._id).subscribe(() => {
        const action = { type: ActionType.deleteAllItems, payload: this.cartItems };
        this.redux.dispatch(action);
        this.overallPrice = 0;
        this.redux.getState().totalPrice = 0;
        this.redux.getState().orderBtn = true;

      });
    }
  }

  public orderAction(): void {
    this.order = {
      user: this.user._id,
      cart: this.cart[0]._id,
      final_price: this.overallPrice,
      delivery_city: this.user.city,
      delivery_street: this.user.street,
      delivery_house: this.user.house_number,
      delivery_date: new Date().toDateString(),
      cc_number: 99999
    }
    this.redux.getState().order = this.order;
    this.router.navigate(["/order"]);
  }

}
