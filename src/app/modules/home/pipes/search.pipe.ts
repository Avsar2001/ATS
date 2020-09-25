import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  public transform(value, keys: string, term: string) {

    if (!term) return value;
    return (value || []).filter(item => keys.split(',').some(key =>

      // let val: string[];
      // val = key.split('.');
      // if (item.hasOwnProperty(val[0]) && new RegExp(term, 'gi').test(item[val[0]])) {
      //   return item.hasOwnProperty(val[0]) && new RegExp(term, 'gi').test(item[val[0]]);
      // }
      // else if (item.hasOwnProperty(val[0])) {
      //   if (item.hasOwnProperty(val[1]) && new RegExp(term, 'gi').test(item[val[1]])) {
      //     return item.hasOwnProperty(val[1]) && new RegExp(term, 'gi').test(item[val[1]]);
      //   }
      // }
      item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])
    ));

  }
}
