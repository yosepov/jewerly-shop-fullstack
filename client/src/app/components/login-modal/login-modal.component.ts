import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
  @Input() alertStyle: any;
  @Input() header: any;
  @Input() message: any;
  @Input() continueShopping: string;
  @Input() startShopping: string;
  @Input() submit: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public goToProducts(): void {
    this.router.navigate(["/products"]);
  }

}
