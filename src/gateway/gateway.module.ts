import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';
import { Services } from 'src/utils/constants';

@Module({
  providers: [
    AppGateway,

    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [
    AppGateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GateWayModule {}
