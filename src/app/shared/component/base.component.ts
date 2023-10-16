import { ControlValueAccessor } from '@angular/forms';

export class BaseComponent<T> implements ControlValueAccessor {
  value: T;
  protected onChange: (value: T) => void;
  protected onTouched: () => void;

  setValue(value: T) {
    if (this.onChange) {
      this.onChange(value);
    }
  }
  onEnter(value: T) {
    if (this.onChange) {
      this.onChange(value);
    }
  }
  writeValue(value: T): void {
    this.value = value;
  }
  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  normalize(value: T) {
    return value
  }
}
