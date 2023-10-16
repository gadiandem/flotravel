import { Component, HostBinding, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: "app-hotel-simulator-admin-layout",
  templateUrl: "hotel-simulator-admin-layout.component.html",
  styleUrls: ["hotel-simulator-admin-layout.component.css"]
})

export class HotelSimulatorAdminLayoutComponent implements OnInit{
  @HostBinding('class') class = 'wrapper';
  public sidebarMenuOpened = true;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  toggleMenuSidebar() {
    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(document.querySelector('app-root'), 'sidebar-open');
      this.renderer.addClass(document.querySelector('app-root'), 'sidebar-collapse');
      this.sidebarMenuOpened = false;
    }else {
      this.renderer.removeClass(document.querySelector('app-root'), 'sidebar-collapse');
      this.renderer.addClass(document.querySelector('app-root'), 'sidebar-open');
      this.sidebarMenuOpened = true;
    }
  }
}
