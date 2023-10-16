export class ApplicationError implements Error {
  public name = "ApplicationError";
  constructor(public message: string) {
    if (typeof console !== "undefined") {
      console.log(`Creating ${this.name} "${message}"`);
    }
  }
  toString() {
    return `${this.name}: ${this.message}`;
  }
}
