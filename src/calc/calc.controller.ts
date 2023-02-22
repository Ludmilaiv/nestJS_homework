import { Controller, Put, Req, Body, Request } from '@nestjs/common';
import { CalcService } from './calc.service';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService){}

  @Put()
  calculate(
    @Req() req: Request,
    @Body() {x, y}: {x: number, y: number}
    ) {
    const op = req.headers['type-operation'];
    return this.calcService.calc(op, x, y);
  }
}
