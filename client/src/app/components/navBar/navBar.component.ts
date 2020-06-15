import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { NgRedux } from 'ng2-redux';
import { AppState } from 'src/app/redux/appState';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class HeaderComponent implements OnInit {

  public connectedUser: User;
  public admin: boolean;
  router: any;


  constructor(private redux: NgRedux<AppState>) { }

  public ngOnInit() {




  }



}
