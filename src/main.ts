import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

async function bootstrap() {
  const app: any = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle("Everything-To-MP3 Documentation")
    .setDescription("The E2MP3 Doc.")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  await app.listen(3000)
}
bootstrap()
