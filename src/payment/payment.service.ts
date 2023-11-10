import { Injectable } from "@nestjs/common"
import * as dotenv from "dotenv"
dotenv.config()

@Injectable()
export class PaymentService {
    async createPayment(userId:string): Promise<string> {
      const stripe = require('stripe')(process.env.STRIPE_API_KEY);

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        line_items: [
          {price: 'price_1OAsM3K5m5JuNCOYsgZG2JPP', quantity: 1},
        ],
        metadata: {userId: userId}
      });
      console.log(session)
      return session
    }

    async handleWebhook(webhookData): Promise<void> {
      const session = webhookData.data.object;
  
      if (webhookData.type === 'checkout.session.completed') {
        const userId = session.metadata.userId;
        console.log(`Paiement complet pour l'utilisateur ID: ${userId}`);
      }
    }

}
