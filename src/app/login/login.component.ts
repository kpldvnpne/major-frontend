import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router) { }

  username:string;
  password:string;
  //TODO: Add form validation
  invalidCredentials=false;
  
  passwordType="password";
  iconSrc = "../assets/icons/pv.png";
  showPassword(){
    if(this.passwordType=="password"){
      this.passwordType="text";
      this.iconSrc = "../assets/icons/pnv.png";
    }
    else{
      this.passwordType="password";
      this.iconSrc = "../assets/icons/pv.png";
    }
  }

  onSubmit(){
    this.router.navigateByUrl('/login?username=kuldip&password=boss');
  }

  ngOnInit() {
  }

}
