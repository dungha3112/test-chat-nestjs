import { Inject, Injectable } from '@nestjs/common';
import { AppGateway } from 'src/gateway/gateway';
import { Services } from 'src/utils/constants';

@Injectable()
export class GroupRecipientEvent {
  constructor(private readonly _appAppGateway: AppGateway) {}
}
