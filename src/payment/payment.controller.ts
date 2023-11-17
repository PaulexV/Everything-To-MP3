import {
    ApiBearerAuth,
    ApiExcludeEndpoint,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger"
import {
    Headers,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
} from "@nestjs/common"
import { PaymentService } from "./payment.service"
import { Public } from "../auth/auth.service"
import Stripe from "stripe"
import { Request } from "express"

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
    private stripe: Stripe
    constructor(private readonly PaymentService: PaymentService) {
        this.stripe = new Stripe(process.env.STRIPE_API_KEY)
    }

    @ApiResponse({
        status: 200,
        description: "Return a url redirecting to the payment page.",
        type: String,
    })
    @ApiBearerAuth()
    @Get("createLink")
    async createLink(@Req() req: any) {
        console.log(req.user.id)
        let userId = req.user.id
        try {
            const paymentUrl = await this.PaymentService.createPayment(userId)
            return paymentUrl
        } catch (error) {
            throw new HttpException(
                "Erreur lors de la création du lien de paiement",
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @ApiExcludeEndpoint()
    @Public()
    @Post("webhook")
    async handleWebhook(
        @Headers("stripe-signature") signature: string,
        @Req() req: Request,
    ) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
        let event

        try {
            event = this.stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret,
            )
        } catch (err) {
            throw new HttpException(
                `Webhook Error: ${err.message}`,
                HttpStatus.BAD_REQUEST,
            )
        }

        await this.PaymentService.handleWebhook(event)
    }
}
