import {Component, HostBinding, Renderer2, OnInit} from '@angular/core';

@Component({
  selector: "special-app-provider-layout",
  templateUrl: "special-provider-layout.component.html",
  styleUrls: ["special-provider-layout.component.css"]
})

export class SpecialProviderLayoutComponent implements OnInit{
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
