import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.css']
})
export class LoginHeaderComponent implements OnInit {
  navbarOpen = false;
  constructor() { }

  ngOnInit() {
  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
}
