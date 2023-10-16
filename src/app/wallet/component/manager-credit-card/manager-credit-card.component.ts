import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-manager-credit-card',
  templateUrl: './manager-credit-card.component.html',
  styleUrls: ['./manager-credit-card.component.css']
})
export class ManagerCreditCardComponent implements OnInit {
  isCollapsed: boolean;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
  }

  addCard() {
    this.route.navigate(["../addCard"], { relativeTo: this.activeRoute });
  }

  verifyCard() {
    this.route.navigate(["../verifyCard"], { relativeTo: this.activeRoute });
  }
}
