import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-user-agent-manager',
  templateUrl: './user-agent-manager.component.html',
  styleUrls: ['./user-agent-manager.component.css']
})
export class UserAgentManagerComponent implements OnInit {
  isCollapsed: boolean;
  constructor(
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isCollapsed = false;
  }

  next() {
    this.route.navigate(["../addUser"], { relativeTo: this.activeRoute });
  }
}
