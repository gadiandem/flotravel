export class Meta {
  adult: number;
  child: number;
  infant: number;
  bags: Bags;
}

export class Bags {
  small: number;
  medium: number;
  large: number;

  constructor(small: number, medium: number, large: number) {
    this.small = small;
    this.medium = medium;
    this.large = large;
  }
}
