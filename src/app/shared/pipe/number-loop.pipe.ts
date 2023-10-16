import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberLoop' })
export class NumberLoopPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const res = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }
}
