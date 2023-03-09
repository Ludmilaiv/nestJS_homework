import { Injectable } from '@nestjs/common';

@Injectable()
export class CalcService {
    calc(op: 'plus' | 'mult' | 'div', x: number, y: number): number {
        if (op === 'plus') {
            return x + y;
        } else if (op === 'mult') {
            return x * y;
        } else if (op === 'div') {
            return x / y;
        } else return null;
    }
}
