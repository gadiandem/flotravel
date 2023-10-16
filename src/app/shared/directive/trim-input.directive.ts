import { Directive, EventEmitter, Input, ChangeDetectorRef, Output, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
  selector: '[appTrim]'
})
export class TrimDirective {
  @Output() ngModelChange = new EventEmitter();

  constructor(private el: ElementRef,
    private control: NgControl) {
  }

  /**
   * Trim the input value on focus out of input component
   */
  @HostListener('focusout') onFocusOut() {
    (this.el.nativeElement as HTMLInputElement).value = (this.el.nativeElement as HTMLInputElement).value.trim();
    this.ngModelChange.emit(this.el.nativeElement.value)
    this.control.control.setValue(this.el.nativeElement.value)
  }
}
