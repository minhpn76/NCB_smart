import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderby'
})
export class OrderbyPipe implements PipeTransform {

    transform(records :Array<Object>, args?: any): any {
        if (records != null) {
            
            return records.sort(function (a, b) {
                if (a[args.property] === '' || a[args.property] === null || typeof a[args.property] === 'undefined') {
                    return 1 * args.direction;
                    }
                    if (b[args.property] === '' || b[args.property] === null || typeof b[args.property] === 'undefined') {
                    return -1 * args.direction;
                    }
                if(a[args.property] < b[args.property]){
                    return -1 * args.direction;
                }
                else if( a[args.property] > b[args.property]){
                    return 1 * args.direction;
                }
                else{
                    return 0;
                }
            });
        }
    };

}