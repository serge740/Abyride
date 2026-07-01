import { BadRequestException, Controller, Headers, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from '../../Global/payment/payment.service';
import { TripService } from './trip.service';

/**
 * Stripe needs the RAW request body to verify the webhook signature.
 * main.ts mounts express.raw() on this exact path before the global json()
 * parser, so `request.body` here is a Buffer, not parsed JSON.
 */
@Controller('payments')
export class TripPaymentWebhookController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly tripService: TripService,
  ) {}

  @Post('webhook')
  async handleWebhook(@Req() request: Request, @Headers('stripe-signature') signature: string) {
    if (!signature) throw new BadRequestException('Missing Stripe signature');

    let event;
    try {
      event = this.paymentService.constructEvent(request.body as Buffer, signature);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.tripService.markPaid(event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        await this.tripService.markFailed(event.data.object.id);
        break;
    }

    return { received: true };
  }
}
