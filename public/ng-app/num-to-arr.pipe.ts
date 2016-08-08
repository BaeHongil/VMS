/**
 * Created by manager on 2016-08-08.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'numToArr'})
export class NumToArr implements PipeTransform {
    transform(value: number): Array<number> {
        let res = [];
        for (let i = 0; i < value; i++) {
            res.push(i);
        }
        return res;
    }
}

@Pipe({name: 'sqrt'})
export class Sqrt implements PipeTransform {
    transform(value: number): number {
        return Math.ceil( Math.sqrt(value) );
    }
}