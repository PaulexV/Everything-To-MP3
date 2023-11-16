import { Module } from "@nestjs/common"
import { PaymentController } from "./payment.controller"
import { PaymentService } from "./payment.service"
import { UserService } from "../user/user.service"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "../user/user.schema"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    ],
    controllers: [PaymentController],
    providers: [UserService, PaymentService],
})
export class PaymentModule {}
