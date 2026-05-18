import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  root() {
    return { message: 'Kramnik Shop API' }
  }

  @Get('health')
  health() {
    return { status: 'ok' }
  }
}
