import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ServerGroupMessageEvent, Services } from 'src/utils/constants';
import { IGroupService } from 'src/utils/interfaces';
import { TMessageGroupPayload } from 'src/utils/types';

@Injectable()
export class GroupMessageEvent {
  constructor(
    private readonly _appGateway: AppGateway,

    @Inject(Services.GROUP) private readonly _groupService: IGroupService,
  ) {}

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_CREATE)
  async handleGroupMessageCreateEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const ROOM_NAME = `group-${group.id}`;

    this._appGateway.server.to(ROOM_NAME).emit('onGroupMessageCreate', {
      group,
      message: payload.message,
    });
  }

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_EDIT)
  async handleGroupMessageEditEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const ROOM_NAME = `group-${group.id}`;

    this._appGateway.server
      .to(ROOM_NAME)
      .emit('onGroupMessageEdit', { group, message: payload.message });
  }

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_DELETE)
  async handleGroupMessageDeleteEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const ROOM_NAME = `group-${group.id}`;

    this._appGateway.server
      .to(ROOM_NAME)
      .emit('onGroupMessageDelete', { group, message: payload.message });
  }
}
