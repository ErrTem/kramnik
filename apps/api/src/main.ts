import 'dotenv/config'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './shared-types'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: 'http://localhost:5173' })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()