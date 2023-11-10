import { ApiTags } from "@nestjs/swagger"
import { Body, Controller, Get, Post } from "@nestjs/common"
import { PaymentService } from "./payment.service"
import { Public } from "src/auth/auth.service"

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
    constructor(private readonly PaymentService: PaymentService) {}

    @Public() // TODO: secure route
    @Get("create-link")
    async createLink() {
        let userId = "123" // TODO : good user ID
        await this.PaymentService.createPayment(userId)
    }

    @Public()
    @Post("webhook")
    async handleWebhook(@Body() webhookData: any) {
        await this.PaymentService.handleWebhook(webhookData)
    }
}
