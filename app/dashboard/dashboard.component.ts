import { Component, Input, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router, Routes, RouterModule } from "@angular/router";

import { LoginService } from "../login/login.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  name: string;

  constructor(private router: Router, private _loginService: LoginService) {}

  ngOnInit() {
    // this.checkTokenExp();
    // this.name=sessionStorage.getItem('user');
    // this.getUser();
  }
  /*
  TODO add it later 
  getUser() {

    this._loginService.GetUsers()
      .subscribe(

        userDetails => {
          if (userDetails !== undefined || userDetails !== null) {
            console.log(userDetails[0].firstName + userDetails[0].lastName);
            sessionStorage.setItem('user', userDetails[0].firstName + ' ' + userDetails[0].lastName);
          } else {
            console.log('not found');

          }
        },
        // (err:HttpErrorResponse)=> {
        //   console.log (err.headers); 
        
         error =>  {
         this._loginService.SetToken();
          console.log('ererer');
        });

  }
  // private handleError(error: any) { 
  //   let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  //   return Observable.throw(error);
  // }
  */
}
