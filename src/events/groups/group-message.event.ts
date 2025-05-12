import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ServerGroupMessageEvent, Services } from 'src/utils/constants';
import { IGroupService } from 'src/utils/interfaces';
import { TMessageGroupPayload } from 'src/utils/types';

@Injectable()
export class GroupRecipientEvent {
  constructor(
    private readonly _appAppGateway: AppGateway,

    @Inject(Services.GROUP) private readonly _groupService: IGroupService,
  ) {}

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_CREATE)
  async handleGroupMessageCreateEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const ROOM_NAME = `group-${group.id}`;
    this._appAppGateway.server
      .to(ROOM_NAME)
      .emit('onGroupMessageCreate', payload);
  }

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_EDIT)
  async handleGroupMessageEditEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const ROOM_NAME = `group-${group.id}`;
    this._appAppGateway.server
      .to(ROOM_NAME)
      .emit('onGroupMessageEdit', payload);
  }

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_DELETE)
  async handleGroupMessageDeleteEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const ROOM_NAME = `group-${group.id}`;
    this._appAppGateway.server
      .to(ROOM_NAME)
      .emit('onGroupMessageDelete', payload);
  }
}
