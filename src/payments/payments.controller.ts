import { Body, Controller, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  @Post('')
  procesPaddlePayment(@Body() body) {
    console.log(body);
    return { ok: true };
  }
}
