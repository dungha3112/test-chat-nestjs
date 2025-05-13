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

    const socketIds: string[] = [];

    await Promise.all(
      group.users.map((user) => {
        const socket = this._appGateway._sessions.getUserSocket(user.id);

        if (socket) {
          socketIds.push(socket.id);
        }
      }),
    );

    if (socketIds.length > 0)
      this._appGateway.server
        .to(socketIds)
        .emit('onGroupMessageCreate', { group, message: payload.message });

    // const ROOM_NAME = `group-${group.id}`;

    // this._appGateway.server.to(ROOM_NAME).emit('onGroupMessageCreate', {
    //   group,
    //   message: payload.message,
    // });
  }

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_EDIT)
  async handleGroupMessageEditEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const socketIds: string[] = [];

    await Promise.all(
      group.users.map((user) => {
        const socket = this._appGateway._sessions.getUserSocket(user.id);

        if (socket) {
          socketIds.push(socket.id);
        }
      }),
    );

    if (socketIds.length > 0)
      this._appGateway.server
        .to(socketIds)
        .emit('onGroupMessageEdit', { group, message: payload.message });

    // const ROOM_NAME = `group-${group.id}`;

    // this._appGateway.server
    //   .to(ROOM_NAME)
    //   .emit('onGroupMessageEdit', { group, message: payload.message });
  }

  @OnEvent(ServerGroupMessageEvent.GROUP_MESSAGE_DELETE)
  async handleGroupMessageDeleteEvent(payload: TMessageGroupPayload) {
    const group = await this._groupService.findGroupById(payload.groupId);
    if (!group) return;

    const socketIds: string[] = [];

    await Promise.all(
      group.users.map((user) => {
        const socket = this._appGateway._sessions.getUserSocket(user.id);

        if (socket) {
          socketIds.push(socket.id);
        }
      }),
    );

    if (socketIds.length > 0)
      this._appGateway.server
        .to(socketIds)
        .emit('onGroupMessageDelete', { group, message: payload.message });

    // const ROOM_NAME = `group-${group.id}`;

    // this._appGateway.server
    //   .to(ROOM_NAME)
    //   .emit('onGroupMessageDelete', { group, message: payload.message });
  }
}
