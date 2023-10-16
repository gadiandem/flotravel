import { Component, HostBinding, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  @HostBinding('class') class = 'wrapper';
  public sidebarMenuOpened = true;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
      this.renderer.removeClass(
          document.querySelector('app-root'),
          'login-page'
      );
      this.renderer.removeClass(
          document.querySelector('app-root'),
          'register-page'
      );
  }

  toggleMenuSidebar() {
      if (this.sidebarMenuOpened) {
          this.renderer.removeClass(
              document.querySelector('app-root'),
              'sidebar-open'
          );
          this.renderer.addClass(
              document.querySelector('app-root'),
              'sidebar-collapse'
          );
          this.sidebarMenuOpened = false;
      } else {
          this.renderer.removeClass(
              document.querySelector('app-root'),
              'sidebar-collapse'
          );
          this.renderer.addClass(
              document.querySelector('app-root'),
              'sidebar-open'
          );
          this.sidebarMenuOpened = true;
      }
  }
}
