import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnInit {
  isCollapsed: boolean;

  constructor(private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isCollapsed = false;
  }

  createCreditCard() {
    this.route.navigate(['../creditCard/addCard'], { relativeTo: this.activeRoute });
  }
  createBank() {
    this.route.navigate(['../bankAccount/addBank'], { relativeTo: this.activeRoute });
  }
  contractDetail() {
    this.route.navigate(['../profile'], { relativeTo: this.activeRoute });
  }
}
