import {Component, HostBinding, Renderer2, OnInit} from '@angular/core';

@Component({
  selector: "app-provider-layout",
  templateUrl: "provider-layout.component.html",
  styleUrls: ["provider-layout.component.css"]
})

export class ProviderLayoutComponent implements OnInit{
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
